const express = require("express");

const { Schedule, Vehicle, Model, Brand, User } = require("../models");

const { sequelize } = require("../models/index");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, dateSchedule, hourSchedule, vehicleId } = req.body;

  await Schedule.create({
    status: "ATIVO",
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
  const { status } = req.query;

  if (status)
    await Schedule.findAll({
      include: [
        {
          model: Vehicle,
          as: "vehicle",
          attributes: ["plate", "color", "kilometer", "year"],
          include: [
            { model: Model, as: "model", attributes: ["model"] },
            { model: Brand, as: "brand", attributes: ["name"] },
            { model: User, as: "user", attributes: ["name"] },
          ],
        },
      ],
      where: { status },
      order: [["dateSchedule", "ASC"]],
      raw: true,
    })
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
  await Schedule.findAll({
    include: [
      {
        model: Vehicle,
        as: "vehicle",
        attributes: ["plate", "color", "kilometer", "year"],
        include: [
          { model: Model, as: "model", attributes: ["model"] },
          { model: Brand, as: "brand", attributes: ["name"] },
          { model: User, as: "user", attributes: ["name"] },
        ],
      },
    ],
    order: [["dateSchedule", "ASC"]],
    raw: true,
  })
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
  const { status } = req.body;
  const { id } = req.params;

  await Schedule.findOne({ where: { id } })
    .then(async function (agendamento) {
      if (!agendamento)
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar o agendamento",
        });

      await Schedule.update(
        { status },
        {
          where: { id: agendamento.dataValues.id },
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

router.get("/:id/estatistica", async (req, res) => {
  const { status } = req.query;

  if (status)
    await Schedule.count({
      where: { status },
    })
      .then(function (agendamento) {
        return res.jsonOK({
          data: { count: agendamento },
          status: 200,
          message: "Agendamento encontrado com sucesso!",
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

  await Schedule.count()
    .then(function (agendamento) {
      return res.jsonOK({
        data: { count: agendamento },
        status: 200,
        message: "Agendamento encontrado com sucesso!",
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
