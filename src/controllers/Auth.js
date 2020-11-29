const express = require("express");
const bcrypt = require("bcrypt");

const { Operator } = require("../models");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const account = await Operator.findOne({ where: { email } });

  const match = account ? bcrypt.compareSync(senha, account.senha) : null;
  if (!match)
    return res.jsonError({
      status: 401,
      message: "Credenciais inválidas",
    });
  return res.jsonOK({ data: account });
});

module.exports = router;
