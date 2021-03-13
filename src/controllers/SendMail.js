const express = require("express");

const { User } = require("../models");
const sendMail = require("../services/Email");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, subject, text, password } = req.body;

  await User.findOne({ where: { email } })
    .then(async function (account) {
      if (!account)
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar o usuário",
        });

      const response = await sendMail({
        to: email,
        subject: "Primeiro Acesso",
        variables: {
          password,
          login: email,
        },
      });

      return res.jsonOK({
        data: response,
        status: 200,
        message: "E-mail enviado com sucesso!",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao enviar o e-mail",
      });
    });
});

module.exports = router;
