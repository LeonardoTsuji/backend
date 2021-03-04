const express = require("express");

const { Resource, Role } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;

  await Resource.findOne({ where: { name } })
    .then(async function (resource) {
      if (resource)
        return res.jsonError({
          data: null,
          status: 400,
          message: "Recurso já cadastrado",
        });

      await Resource.create({
        name,
      })
        .then(function (newResource) {
          return res.jsonOK({
            data: newResource,
            status: 201,
            message: "Cadastro do recurso efetuado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            status: 400,
            data: err,
            message: "Não foi possível criar o recurso",
          });
        });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao criar o recurso",
      });
    });
});

router.get("/", async (req, res) => {
  await Resource.findAll({
    include: [
      {
        model: Role,
        as: "role",
      },
    ],
  })
    .then(function (resources) {
      if (resources)
        return res.jsonOK({
          data: resources,
          status: 200,
          message: "Recursos encontrados com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os recursos",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar o recurso",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  await Resource.findByPk(id)
    .then(function (resource) {
      if (resource)
        return res.jsonOK({
          data: resource,
          status: 200,
          message: "Recurso encontrada com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o recurso",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar o recurso",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  await Resource.findByPk(id)
    .then(async function (resource) {
      if (resource) {
        await Resource.update(
          { name, description },
          {
            where: { id: resource.dataValues.id },
            returning: true,
            plain: true,
          }
        )
          .then(function (updatedResource) {
            return res.jsonOK({
              data: updatedResource,
              status: 200,
              message: "Recurso atualizado com sucesso!",
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
      return err.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o recurso",
      });
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Resource.findByPk(id)
    .then(async function (resource) {
      console.log(resource);
      if (resource) {
        await Resource.destroy({
          where: { id: resource.dataValues.id },
        })
          .then(function (updatedResource) {
            return res.jsonOK({
              data: updatedResource,
              status: 200,
              message: "Recurso excluído com sucesso!",
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
        message: "Não foi possível encontrar o recurso",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o recurso",
      });
    });
});

module.exports = router;
