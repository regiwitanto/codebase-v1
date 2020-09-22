const conflict = async(res, result, message) => {
  res.status(409).
  send({
    success: false,
    data: result,
    message: message,
    code: 409
  });
};

const created = async(res, result, message) => {
  res.status(201).
  send({
    success: true,
    data: result,
    message: message,
    code: 201
  });
};

const badRequest = async(res, result, message) => {
  res.status(400).
  send({
    success: false,
    data: result,
    message: message,
    code: 400
  });
};

const ok = async(res, result, message) => {
  res.status(200).
  send({
    success: true,
    data: result,
    message: message,
    code: 200
  });
};

const internalServerError = async(res, result, message) => {
  res.status(500).
  send({
    success: false,
    data: result,
    message: message,
    code: 500
  });
};

const unauthorized = async(res, result, message) => {
  res.status(401).
  send({
    success: false,
    data: result,
    message: message,
    code: 401
  });
};

const forbidden = async(res, result, message) => {
  res.status(403).
  send({
    success: false,
    data: result,
    message: message,
    code: 403
  });
};

module.exports = {
  conflict,
  created,
  badRequest,
  ok,
  internalServerError,
  unauthorized,
  forbidden
}