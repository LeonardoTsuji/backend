const express = require("express");

const { Model } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { model, brandId } = req.body;

  await Model.findOne({ where: { model } })
    .then(async function (modelo) {
      if (modelo)
        return res.jsonError({
          data: null,
          status: 400,
          message: "Modelo já cadastrado",
        });

      await Model.create({ model, brandId })
        .then(function (novoModelo) {
          return res.jsonOK({
            data: novoModelo,
            status: 201,
            message: "Modelo cadastrado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            status: 400,
            data: err,
            message: "Não foi possível cadastrar o modelo",
          });
        });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao cadastrar o modelo",
      });
    });
});

router.get("/", async (req, res) => {
  const { brandId } = req.query;

  if (brandId)
    await Model.findAll({
      where: { brandId },
    })
      .then(function (modelos) {
        if (modelos)
          return res.jsonOK({
            data: modelos,
            status: 200,
            message: "Modelos encontrado com sucesso!",
          });
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar os modelos",
        });
      })
      .catch(function (err) {
        console.log(err, "err");
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar os modelos",
        });
      });

  await Model.findAll()
    .then(function (modelos) {
      if (modelos)
        return res.jsonOK({
          data: modelos,
          status: 200,
          message: "Modelos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os modelos",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os modelos",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  await Model.findByPk(id)
    .then(function (modelo) {
      if (modelo)
        return res.jsonOK({
          data: modelo,
          status: 200,
          message: "Modelo encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o modelo",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar o modelo",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { model, brandId } = req.body;

  await Model.findByPk(id)
    .then(async function (modelo) {
      if (modelo) {
        await Model.update(
          { model, brandId },
          {
            where: { id: modelo.dataValues.id },
            returning: true,
            plain: true,
          }
        )
          .then(function (modeloAtualizado) {
            return res.jsonOK({
              data: modeloAtualizado,
              status: 200,
              message: "Modelo atualizado com sucesso!",
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
      console.log(err);
      return res.jsonError({
        data: err,
        status: 404,
        message: "Não foi possível encontrar o modelo",
      });
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Model.findByPk(id)
    .then(async function (modelo) {
      if (modelo) {
        await Model.destroy({
          where: { id: modelo.dataValues.id },
        })
          .then(function (modeloAtualizado) {
            return res.jsonOK({
              data: modeloAtualizado,
              status: 200,
              message: "Modelo excluído com sucesso!",
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
        message: "Não foi possível encontrar o modelo",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o modelo",
      });
    });
});

module.exports = router;
