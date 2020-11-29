const TYPE_JSON = 'application/json';
const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_UNAUTHORIZED = 401;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_SERVER_ERROR = 500;

const jsonOK = function ({ data, message, metadata, status }) {
  status = status || STATUS_CODE_OK;
  message = message || 'Successful';
  metadata = metadata || {};

  this.status(status);
  this.type(TYPE_JSON);
  return this.json({ message, data, metadata, status, success: true });
};

const jsonError = function ({ data, message, metadata, status }) {
  status = status || STATUS_CODE_BAD_REQUEST;
  message = message || 'Error';
  metadata = metadata || {};

  this.status(status);
  this.type(TYPE_JSON);
  return this.json({ message, data, metadata, status, success: false });
};

const response = (req, res, next) => {
  res.jsonOK = jsonOK;
  res.jsonError = jsonError;

  next();
};

module.exports = response;
