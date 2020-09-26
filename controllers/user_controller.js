const User = require('../models/User');
const response = require('../helpers/utils/response');
const { v4: uuidv4 } = require('uuid');
const validate = require('validate.js');
const dateFormat = require('dateformat');
const bcrypt = require('bcrypt');
const jwtAuth = require('../helpers/auth/jwt_auth_helper');

const createUser = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username: username });
    if (user) {
      return response.conflict(res, null, 'User already exist.');
    }

    const data = {
      userId: uuidv4(),
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      createdAt: Date.now(),
    };

    const newUser = await new User(data).save();

    return response.created(res, newUser, 'User created.');
  } catch (err) {
    return response.badRequest(res, null, err.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const { searchBy, search = '', page, limit } = req.query;
    if (page == 0) {
      return response.badRequest(res, null, 'Page must start from 1.');
    }

    const users = await User.paginate(
      {
        [searchBy]: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: { createdAt: -1 },
      }
    );
    if (validate.isEmpty(users)) {
      return response.ok(res, result, 'User not found.');
    }

    const docs = [];
    users.docs.map((value) => {
      const user = {
        firstName: value.firstName,
        lastName: value.lastName,
        createdAt: dateFormat(value.createdAt, 'yyyy-mm-dd HH:MM:ss'),
        updatedAt: dateFormat(value.updatedAt, 'yyyy-mm-dd HH:MM:ss'),
      };
      docs.push(user);
    });

    const result = {
      docs: docs,
      page: users.page,
      limit: users.limit,
      totalPages: users.totalPages,
      totalDocs: users.totalDocs,
    };

    return response.ok(res, result, 'User data.');
  } catch (err) {
    return response.internalServerError(res, null, err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ userId: userId });
    if (validate.isEmpty(user)) {
      return response.ok(res, {}, 'User not found.');
    }

    const result = {
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: dateFormat(user.createdAt, 'yyyy-mm-dd HH:MM:ss'),
      updatedAt: dateFormat(user.updatedAt, 'yyyy-mm-dd HH:MM:ss'),
    };

    return response.ok(res, result, 'User data.');
  } catch (err) {
    return response.internalServerError(res, null, err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ userId: userId });
    if (validate.isEmpty(user)) {
      return response.ok(res, {}, 'User not found.');
    }

    const data = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      updatedAt: Date.now(),
    };

    const updatedUser = await User.updateOne({ userId: userId }, data);

    return response.ok(res, updatedUser, 'User updated.');
  } catch (err) {
    return response.badRequest(res, null, err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ userId: userId });
    if (validate.isEmpty(user)) {
      return response.ok(res, {}, 'User not found.');
    }

    const deletedUser = await User.deleteOne({ userId: userId });

    return response.ok(res, deletedUser, 'User deleted.');
  } catch (err) {
    return response.internalServerError(res, null, err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (validate.isEmpty(user)) {
      return response.unauthorized(res, null, 'Invalid username or password.');
    }

    const pass = password
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!pass) {
      return response.unauthorized(res, null, 'Invalid username or password.');
    }

    const data = {
      username,
      sub: user.userId,
    };

    const token = await jwtAuth.generateToken(data);

    return response.ok(res, token, 'Login success.');
  } catch (err) {
    return response.badRequest(res, null, err.message);
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
};
