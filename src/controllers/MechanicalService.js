const express = require("express");

const { MechanicalService } = require("../models");

const router = express.Router();
const { verifyJwt } = require("../helpers/jwt");

router.post("/", verifyJwt, async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price)
    return res.jsonError({
      status: 400,
      data: err,
      message: "É necessário preecnher os campos obrigatórios: nome, descrição e preço",
    });

  await MechanicalService.findOne({ where: { name } })
    .then(async function (servicoMecanico) {
      if (servicoMecanico)
        return res.jsonError({
          data: null,
          status: 400,
          message: "Serviço mecânico já cadastrado",
        });

      await MechanicalService.create({ name, description, price })
        .then(function (novoProduto) {
          return res.jsonOK({
            data: novoProduto,
            status: 201,
            message: "Serviço mecânico cadastrado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            status: 400,
            data: err,
            message: "Não foi possível cadastrar o servicoMecanico",
          });
        });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao cadastrar o servicoMecanico",
      });
    });
});

router.get("/", async (req, res) => {
  await MechanicalService.findAll()
    .then(function (servicosMecanicos) {
      if (servicosMecanicos)
        return res.jsonOK({
          data: servicosMecanicos,
          status: 200,
          message: "Serviços mecânicos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os servicosMecanicos",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os servicosMecanicos",
      });
    });
});

router.get("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

  await MechanicalService.findOne({ where: { id } })
    .then(function (servicoMecanico) {
      if (servicoMecanico)
        return res.jsonOK({
          data: servicoMecanico,
          status: 200,
          message: "Serviço mecânico encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o servicoMecanico",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar o servicoMecanico",
      });
    });
});

router.put("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  await MechanicalService.findOne({ where: { id } })
    .then(async function (servicoMecanico) {
      if (servicoMecanico) {
        await MechanicalService.update(
          { name, description, price },
          {
            where: { id: servicoMecanico.dataValues.id },
            returning: true,
            plain: true,
          }
        )
          .then(function (categoriaAtualizada) {
            return res.jsonOK({
              data: categoriaAtualizada,
              status: 200,
              message: "Serviço mecânico atualizado com sucesso!",
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
        message: "Não foi possível encontrar o servicoMecanico",
      });
    });
});

router.delete("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

  await MechanicalService.findOne({ where: { id } })
    .then(async function (servicoMecanico) {
      if (servicoMecanico) {
        await MechanicalService.destroy({
          where: { id: servicoMecanico.dataValues.id },
        })
          .then(function (categoriaAtualizada) {
            return res.jsonOK({
              data: categoriaAtualizada,
              status: 200,
              message: "Serviço mecânico excluído com sucesso!",
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
        message: "Não foi possível encontrar o servicoMecanico",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o servicoMecanico",
      });
    });
});

module.exports = router;
