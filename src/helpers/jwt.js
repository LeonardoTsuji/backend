require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenPrivateKey = process.env.JWT_TOKEN;
const refreshTokenPrivateKey = process.env.JWT_REFRESH_TOKEN;

const options = {
  expiresIn: '10h',
};
const refreshOptions = {
  expiresIn: '30d',
};

const generateJwt = (payload) => {
  return jwt.sign(payload, tokenPrivateKey, options);
};

const generateRefreshJwt = (payload) => {
  return jwt.sign(payload, refreshTokenPrivateKey, refreshOptions);
};

const verifyJwt = (token) => {
  return jwt.verify(token, tokenPrivateKey);
};

const verifyRefreshJwt = (token) => {
  return jwt.verify(token, refreshTokenPrivateKey);
};

const getTokenFromHeaders = (headers) => {
  let token = headers['authorization'];
  return (token = token ? token.slice(7, token.length) : null);
};

module.exports = {
  generateJwt,
  generateRefreshJwt,
  verifyJwt,
  verifyRefreshJwt,
  getTokenFromHeaders,
};
