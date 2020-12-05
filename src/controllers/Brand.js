const express = require("express");

const { Brand } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;

  await Brand.findOne({ where: { name } })
    .then(async function (fabricante) {
      if (fabricante)
        return res.jsonError({
          data: null,
          status: 400,
          message: "Fabricante já cadastrado",
        });

      await Brand.create({ name })
        .then(function (novoProduto) {
          return res.jsonOK({
            data: novoProduto,
            status: 201,
            message: "Fabricante cadastrado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            status: 400,
            data: err,
            message: "Não foi possível cadastrar o fabricante",
          });
        });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao cadastrar o fabricante",
      });
    });
});

router.get("/", async (req, res) => {
  await Brand.findAll()
    .then(function (fabricantes) {
      if (fabricantes)
        return res.jsonOK({
          data: fabricantes,
          status: 200,
          message: "Fabricantes encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os fabricantes",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os fabricantes",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  await Brand.findOne({ where: { id }, include: "produtos" })
    .then(function (fabricante) {
      if (fabricante)
        return res.jsonOK({
          data: fabricante,
          status: 200,
          message: "Fabricante encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o fabricante",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar o fabricante",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await Brand.findOne({ where: { id } })
    .then(async function (fabricante) {
      if (fabricante) {
        await Brand.update(
          { name },
          {
            where: { id: fabricante.dataValues.id },
            returning: true,
            plain: true,
          }
        )
          .then(function (fabricanteAtualizado) {
            return res.jsonOK({
              data: fabricanteAtualizado,
              status: 200,
              message: "Fabricante atualizado com sucesso!",
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
        message: "Não foi possível encontrar o fabricante",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o fabricante",
      });
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Brand.findOne({ where: { id } })
    .then(async function (fabricante) {
      console.log(fabricante);
      if (fabricante) {
        await Brand.destroy({
          where: { id: fabricante.dataValues.id },
        })
          .then(function (fabricanteAtualizado) {
            return res.jsonOK({
              data: fabricanteAtualizado,
              status: 200,
              message: "Fabricante excluído com sucesso!",
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
        message: "Não foi possível encontrar o fabricante",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o fabricante",
      });
    });
});

module.exports = router;
