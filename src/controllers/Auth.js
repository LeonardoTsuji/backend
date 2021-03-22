const express = require("express");
const bcrypt = require("bcrypt");

const {
  generateJwt,
  generateRefreshJwt,
  verifyJwt,
  verifyRefreshJwt,
} = require("../helpers/jwt");
const { User } = require("../models");
const getAccessTokenFromCode = require("../services/FacebookAccessToken");
const getFacebookUserData = require("../services/FacebookUserData");

const router = express.Router();

const saltRounds = 10;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ where: { email } })
    .then(function (account) {
      const match = account
        ? bcrypt.compareSync(password, account.password)
        : null;
      if (!match)
        return res.jsonError({
          status: 401,
          message: "Credenciais inválidas",
        });

      const token = generateJwt({ id: account.id });
      const refreshToken = generateRefreshJwt({
        id: account.id,
        version: account.jwtVersion,
      });
      return res.jsonOK({ data: account, metadata: { token, refreshToken } });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        message: "Não foi possível localizar o usuário",
      });
    });
});

router.post("/facebook", async (req, res) => {
  const { code } = req.body;
  const token = await getAccessTokenFromCode(code);

  if (!token)
    return res.jsonError({
      status: 400,
      message: "Não foi possível localizar o usuário",
    });

  const user = await getFacebookUserData(token);

  if (user) {
    const userDatabase = await User.findOne({ where: { email: user.email } });
    if (userDatabase) {
      const token = generateJwt({ id: userDatabase.id });

      return res.jsonOK({
        data: userDatabase,
        metadata: { token },
      });
    }
  }

  return res.jsonError({ status: 400, data: user });
});

module.exports = router;
