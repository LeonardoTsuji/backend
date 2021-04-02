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
const SendEmail = require("./SendMail");

const router = express.Router();

const saltRounds = 10;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ where: { email, active: true } })
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

router.post("/alterar-senha", verifyJwt, async (req, res) => {
  const { password } = req.body;
  await User.findByPk(req.userId)
    .then(async function (account) {
      const hash = bcrypt.hashSync(password, saltRounds);

      await User.update(
        { password: hash },
        {
          where: { id: account.dataValues.id },
          returning: true,
          plain: true,
        }
      )
        .then(function (updatedUsuario) {
          return res.jsonOK({
            data: updatedUsuario,
            status: 200,
            message: "Senha atualizada com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            data: err,
            status: 400,
            message: "Não foi possível atualizar",
          });
        });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        status: 400,
        message: "Não foi possível localizar o usuário",
      });
    });
});

router.post("/esqueci-senha", async (req, res) => {
  const { email } = req.body;
  await User.findOne({ where: { email } })
    .then(async function (account) {
      if (!account)
        return res.jsonError({
          status: 404,
          message: "Não foi possível localizar o usuário",
        });

      const randomNumber = Math.floor(Math.random() * 100000 + 1);
      const hash = bcrypt.hashSync(randomNumber.toString(), saltRounds);
      const token = generateJwt({ id: account.dataValues.id });

      req.body.login = email;
      req.body.password = randomNumber;
      req.body.subject = "Premium Car Bauru - Senha temporária";
      req.body.token = token;

      await User.update(
        { password: hash },
        {
          where: { id: account.dataValues.id },
          returning: true,
          plain: true,
        }
      )
        .then(function (updatedUsuario) {
          SendEmail.sendUserEmail(req, "login");

          return res.jsonOK({
            data: updatedUsuario,
            status: 200,
            message: "E-mail enviado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            data: err,
            status: 400,
            message: "Não foi possível enviar o e-mail",
          });
        });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        status: 400,
        message: "Não foi possível localizar o usuário",
      });
    });
});

module.exports = router;
