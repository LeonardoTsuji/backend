const express = require("express");

const { ResourceRole } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { resourceId, roleId, permission } = req.body;
  await ResourceRole.create({
    resourceId,
    roleId,
    permission,
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

router.get("/", async (req, res) => {
  await ResourceRole.findAll()
    .then(function (roles) {
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
