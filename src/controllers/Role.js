const express = require("express");

const { Role, Resource, ResourceRole } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, description } = req.body;

  await Role.findOne({ where: { name } })
    .then(async function (account) {
      if (account)
        return res.jsonError({
          data: null,
          status: 400,
          message: "Regra já cadastrada",
        });

      await Role.create({
        name,
        description,
      })
        .then(function (newUsuario) {
          return res.jsonOK({
            data: newUsuario,
            status: 201,
            message: "Cadastro da regra efetuado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            status: 400,
            data: err,
            message: "Não foi possível criar a regra",
          });
        });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao criar a regra",
      });
    });
});

router.get("/", async (req, res) => {
  const { name } = req.query;

  if (name) {
    await Role.findOne({ where: { name } })
      .then(function (role) {
        if (role)
          return res.jsonOK({
            data: role,
            status: 200,
            message: "Regra encontrada com sucesso!",
          });
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar a regra",
        });
      })
      .catch(function (err) {
        return res.jsonError({
          data: {},
          status: 400,
          message: "Erro ao encontrar a regra",
        });
      });
  }

  await Role.findAll({
    include: [
      {
        model: Resource,
        as: "resource",
        required: false,
      },
    ],
  })
    .then(function (roles) {
      if (roles)
        return res.jsonOK({
          data: roles,
          status: 200,
          message: "Regras encontradas com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar as regras",
      });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar a regra",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  await Role.findByPk(id)
    .then(function (role) {
      if (role)
        return res.jsonOK({
          data: role,
          status: 200,
          message: "Regra encontrada com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar a regra",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar a regra",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  await Role.findByPk(id)
    .then(async function (role) {
      if (role) {
        await Role.update(
          { name, description },
          {
            where: { id: role.dataValues.id },
            returning: true,
            plain: true,
          }
        )
          .then(function (updatedRole) {
            return res.jsonOK({
              data: updatedRole,
              status: 200,
              message: "Regra atualizado com sucesso!",
            });
          })
          .catch(function (err) {
            return res.jsonError({
              data: err,
              status: 400,
              message: "Não foi possível atualizar",
            });
          });
      }
    })
    .catch(function (err) {
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar a regra",
      });
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Role.findByPk(id)
    .then(async function (role) {
      console.log(role);
      if (role) {
        await Role.destroy({
          where: { id: role.dataValues.id },
        })
          .then(function (updatedRole) {
            return res.jsonOK({
              data: updatedRole,
              status: 200,
              message: "Regra excluída com sucesso!",
            });
          })
          .catch(function (err) {
            return res.jsonError({
              data: err,
              status: 400,
              message: "Não foi possível atualizar",
            });
          });
      }

      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar a regra",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar a regra",
      });
    });
});

module.exports = router;
