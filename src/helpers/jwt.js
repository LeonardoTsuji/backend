require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenPrivateKey = process.env.JWT_TOKEN;
const refreshTokenPrivateKey = process.env.JWT_REFRESH_TOKEN;

const options = {
  expiresIn: "30d",
};
const refreshOptions = {
  expiresIn: "60d",
};

const generateJwt = (payload) => {
  return jwt.sign(payload, tokenPrivateKey, options);
};

const generateRefreshJwt = (payload) => {
  return jwt.sign(payload, refreshTokenPrivateKey, refreshOptions);
};

const verifyJwt = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  const bearer = token.split(" ");
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_TOKEN, function (err, decoded) {
    if (err)
      return res.status(401).json({ auth: false, message: "Invalid token" });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
};

const verifyRefreshJwt = (token) => {
  return jwt.verify(token, refreshTokenPrivateKey);
};

const getTokenFromHeaders = (headers) => {
  let token = headers["authorization"];
  return (token = token ? token.slice(7, token.length) : null);
};

module.exports = {
  generateJwt,
  generateRefreshJwt,
  verifyJwt,
  verifyRefreshJwt,
  getTokenFromHeaders,
};
