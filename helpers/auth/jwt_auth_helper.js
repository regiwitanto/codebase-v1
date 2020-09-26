const jwt = require('jsonwebtoken');
const config = require('../../infra/configs/global_config');
const response = require('../utils/response');
const User = require('../../models/User');

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, config.get('/privateKey'), {
    expiresIn: 7 * 24 * 60 * 60,
  });
  return token;
};

const getToken = (headers) => {
  if (
    headers &&
    headers.authorization &&
    headers.authorization.includes('Bearer')
  ) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
  }
  return undefined;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = getToken(req.headers);
    if (!token) {
      return response.forbidden(res, null, 'Invalid token!');
    }
    let decodedToken;
    try {
      decodedToken = await jwt.verify(token, config.get('/privateKey'));
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return response.unauthorized(res, null, 'Access token expired!');
      }
      return response.unauthorized(res, null, 'Token is not valid!');
    }
    const userId = decodedToken.sub;
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.forbidden(res, null, 'Invalid token!');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
