const express = require("express");

const { RoleUser } = require("../models");

const router = express.Router();

router.post("/vinculo", async (req, res) => {
  const { idUsuario, idRegra } = req.body;
  await RoleUser.create({
    userId: idUsuario,
    roleId: idRegra,
  })
    .then(async function (role) {
      return res.jsonOK({
        data: role,
        status: 201,
        message: "Vínculo criado com sucesso!",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao criar um vínculo",
      });
    });
});

router.get("/vinculo", async (req, res) => {
  const { idUsuario, idRegra } = req.body;
  await RoleUser.findAll({ where: { userId: idUsuario } })
    .then(async function (roles) {
      if (roles) {
        return res.jsonOK({
          data: roles,
          status: 200,
          message: "Vínculos encontrados com sucesso!",
        });
      }
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar um vínculo",
      });
    });
});

module.exports = router;
