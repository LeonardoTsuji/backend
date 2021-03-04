const express = require("express");
const bcrypt = require("bcrypt");

const {
  generateJwt,
  generateRefreshJwt,
  verifyJwt,
  verifyRefreshJwt,
} = require("../helpers/jwt");
const { User } = require("../models");

const router = express.Router();

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

module.exports = router;
