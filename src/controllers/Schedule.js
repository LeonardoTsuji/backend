const express = require("express");

const { QueryTypes } = require("sequelize");

const { Schedule } = require("../models");

const { sequelize } = require("../models/index");
const router = express.Router();

router.post("/", async (req, res) => {
  const { status, userId, dateSchedule, hourSchedule } = req.body;

  await Schedule.create({
    status,
    userId,
    dateSchedule,
    hourSchedule,
    vehicleId,
  })
    .then(function (novoAgendamento) {
      return res.jsonOK({
        data: novoAgendamento,
        status: 201,
        message: "Agendamento cadastrado com sucesso!",
      });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        status: 400,
        data: err,
        message: "Não foi possível cadastrar o agendamento",
      });
    });
});

router.get("/", async (req, res) => {
  await Schedule.findAll()
    .then(function (agendamento) {
      if (agendamento)
        return res.jsonOK({
          data: agendamento,
          status: 200,
          message: "Agendamento encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o agendamento",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar o agendamento",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.query;

  await Schedule.findOne({ where: { id } })
    .then(function (agendamento) {
      if (agendamento)
        return res.jsonOK({
          data: agendamento,
          status: 200,
          message: "Agendamento encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o agendamento",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o agendamento",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { status, userId, dateSchedule, hourSchedule } = req.body;
  const { id } = req.params;

  await Schedule.findOne({ where: { id } })
    .then(async function (agendamento) {
      if (agendamento) {
        await Schedule.update(
          { status, userId, dateSchedule, hourSchedule },
          {
            where: { id: agendamento[0].id },
            returning: true,
            plain: true,
          }
        )
          .then(function (produtoAtualizado) {
            return res.jsonOK({
              data: produtoAtualizado,
              status: 200,
              message: "Agendamento atualizado com sucesso!",
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
        message: "Não foi possível encontrar o agendamento",
      });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o agendamento",
      });
    });
});

router.delete("/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  await Schedule.findOne({ where: { id } })
    .then(async function (agendamento) {
      if (agendamento) {
        await Schedule.destroy({
          where: { id: agendamento.dataValues.id },
        })
          .then(function (produtoAtualizado) {
            return res.jsonOK({
              data: produtoAtualizado,
              status: 200,
              message: "Agendamento excluído com sucesso!",
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
        message: "Não foi possível encontrar o agendamento",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o agendamento",
      });
    });
});

router.get("/:id/dia", async (req, res) => {
  await Schedule.findAll({
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("dateSchedule")), "dateSchedule"],
    ],
    raw: true,
  })
    .then(function (agendamento) {
      if (agendamento)
        return res.jsonOK({
          data: agendamento.map((res) => res.dateSchedule),
          status: 200,
          message: "Agendamento encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o agendamento",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar o agendamento",
      });
    });
});

router.get("/:id/hora", async (req, res) => {
  const { dateSchedule } = req.query;

  await Schedule.findAll({
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("hourSchedule")), "hourSchedule"],
    ],
    where: {
      dateSchedule,
    },
    raw: true,
  })
    .then(function (agendamento) {
      if (agendamento)
        return res.jsonOK({
          data: agendamento.map((res) => res.hourSchedule),
          status: 200,
          message: "Agendamento encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o agendamento",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar o agendamento",
      });
    });
});

module.exports = router;
