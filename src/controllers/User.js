const express = require("express");
const bcrypt = require("bcrypt");
const { sequelize } = require("../models/index");
const {
  generateJwt,
  generateRefreshJwt,
  verifyJwt,
  verifyRefreshJwt,
} = require("../helpers/jwt");
const checkJwt = require("../middlewares/jwt");

const {
  User,
  Role,
  Budget,
  Product,
  BudgetProduct,
  Vehicle,
  Schedule,
} = require("../models");

const SendEmail = require("./SendMail");

const router = express.Router();

const saltRounds = 10;

router.post("/", async (req, res) => {
  const { email, password, name, phone, roleId } = req.body;

  await User.findOne({ where: { email } })
    .then(async function (account) {
      if (account)
        return res.jsonError({
          data: null,
          status: 400,
          message: "E-mail já cadastrado",
        });

      const hash = bcrypt.hashSync(password, saltRounds);

      await User.create({ email, phone, name, password: hash, roleId })
        .then(function (newUser) {
          if (newUser) {
            const token = generateJwt({ id: newUser.id });
            const refreshToken = generateRefreshJwt({
              id: newUser.id,
              version: newUser.jwtVersion,
            });

            return res.jsonOK({
              data: newUser,
              status: 201,
              message: "Cadastro efetuado com sucesso!",
              metadata: { token, refreshToken },
            });
          }

          return res.jsonError({
            status: 404,
            data: err,
            message: "Não foi possível encontrar o perfil de usuário!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            status: 400,
            data: err,
            message: "Erro ao criar o usuário",
          });
        });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao criar o usuário",
      });
    });
});

router.get("/", async (req, res) => {
  await User.findAll({
    include: {
      model: Role,
      as: "role",
    },
  })
    .then(function (accounts) {
      if (accounts)
        return res.jsonOK({
          data: accounts,
          status: 200,
          message: "Usuários encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar usuários",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar o usuário",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  await User.findOne({ where: { email } })
    .then(function (account) {
      if (account)
        return res.jsonOK({
          data: account,
          status: 200,
          message: "Usuário encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o usuário",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar o usuário",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { name, email, password, phone, roleId } = req.body;

  await User.findOne({ where: { email } })
    .then(async function (account) {
      if (account) {
        await User.update(
          { name, email, password, phone, roleId },
          {
            where: { id: account.dataValues.id },
            returning: true,
            plain: true,
          }
        )
          .then(function (updatedUsuario) {
            return res.jsonOK({
              data: updatedUsuario,
              status: 200,
              message: "Usuário atualizado com sucesso!",
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
        message: "Não foi possível encontrar o usuário",
      });
    });
});

router.delete("/:id", async (req, res) => {
  const { email } = req.body;

  await User.findOne({ where: { email } })
    .then(async function (account) {
      if (account) {
        await User.destroy({
          where: { id: account.dataValues.id },
        })
          .then(function (updatedUsuario) {
            return res.jsonOK({
              data: updatedUsuario,
              status: 200,
              message: "Usuário excluído com sucesso!",
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
        message: "Não foi possível encontrar o usuário",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o usuário",
      });
    });
});

//Orçamento usuário
router.post("/:id/orcamento", async (req, res) => {
  const {
    expirationDate,
    paymentMethod,
    status,
    userId,
    products,
    userVehicleId,
  } = req.body;

  const savedBudget = await Budget.create({
    expirationDate: expirationDate || new Date(),
    paymentMethod,
    status,
    userId,
    userVehicleId,
  });

  if (products) {
    const promisesProducts = products.map(async (item) => {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        return res.jsonError({
          data: null,
          status: 400,
          message: "Erro ao tentar encontrar o produto",
        });
      }

      const po = {
        budgetId: savedBudget.dataValues.id,
        productId: item.productId,
        quantity: item.quantity,
      };

      await BudgetProduct.create(po, { w: 1 }, { returning: true });
    });

    Promise.all(await promisesProducts);
  }

  return res.jsonOK({
    data: savedBudget,
    status: 200,
    message: "Orçamento criado com sucesso!",
  });
});

router.get("/:id/orcamento", async (req, res) => {
  const { id } = req.params;

  if (id) {
    await Budget.findAll({
      include: [
        {
          model: Product,
          as: "products",
          required: false,
          through: {
            // This block of code allows you to retrieve the properties of the join table
            model: BudgetProduct,
            as: "budgetProduct",
            attributes: ["quantity"],
          },
        },
      ],
      where: { userId: id },
    })
      .then(function (orcamentos) {
        if (orcamentos)
          return res.jsonOK({
            data: orcamentos,
            status: 200,
            message: "Orçamentos encontrado com sucesso!",
          });
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar os orçamentos",
        });
      })
      .catch(function (err) {
        console.log(err, "err");
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar os orçamentos",
        });
      });
  }

  await Budget.findAll({
    include: [
      {
        model: Product,
        as: "products",
        required: false,
        through: {
          // This block of code allows you to retrieve the properties of the join table
          model: BudgetProduct,
          as: "budgetProduct",
          attributes: ["quantity"],
        },
      },
    ],
  })
    .then(function (orcamentos) {
      if (orcamentos)
        return res.jsonOK({
          data: orcamentos,
          status: 200,
          message: "Orçamentos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os orçamentos",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os orçamentos",
      });
    });
});

router.get("/:id/orcamento/:budgetId/valor", async (req, res) => {
  const { id, budgetId } = req.params;

  await Budget.findAll({
    attributes: [
      [sequelize.literal("sum(products.price *  quantity)"), "total"],
    ],
    include: [
      {
        model: Product,
        as: "products",
        required: false,
        attributes: [],
        through: {
          // This block of code allows you to retrieve the properties of the join table
          model: BudgetProduct,
          as: "budgetProduct",
          attributes: [],
          where: { budgetId },
        },
      },
    ],
    raw: true,
    where: { userId: id },
  })
    .then(function (orcamentos) {
      if (orcamentos && orcamentos.length > 0)
        return res.jsonOK({
          data: orcamentos[0],
          status: 200,
          message: "Orçamentos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os orçamentos",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os orçamentos",
      });
    });
});

//Veículo usuário
router.post("/:id/veiculo", async (req, res) => {
  const { model, plate, color, year, kilometer, brandId, modelId } = req.body;
  const { id } = req.params;

  await User.findByPk(id)
    .then(async function () {
      await Vehicle.create({
        model,
        brandId,
        plate,
        color,
        year: Number(year),
        kilometer,
        userId: id,
        modelId,
      })
        .then(function (novoVeiculo) {
          return res.jsonOK({
            data: novoVeiculo,
            status: 201,
            message: "Veículo cadastrado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            data: err,
            status: 400,
            message: "Erro ao tentar cadastrar o veículo",
          });
        });
    })
    .catch(function () {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar cadastrar o veículo",
      });
    });
});

router.get("/:id/veiculo", async (req, res) => {
  const { id } = req.params;
  await User.findAll({
    include: [
      {
        model: Vehicle,
        as: "vehicle",
        required: false,
      },
    ],
    where: {
      id,
    },
  })
    .then(function (veiculos) {
      if (veiculos)
        return res.jsonOK({
          data: veiculos,
          status: 200,
          message: "Veículos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os veículos",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os veículos",
      });
    });
});

router.get("/:id/veiculo/:vehicleId", async (req, res) => {
  const { id, vehicleId } = req.params;
  await User.findAll({
    include: [
      {
        model: Vehicle,
        as: "vehicle",
        required: false,
        where: {
          id: vehicleId,
        },
      },
    ],
    where: {
      id,
    },
    raw: true,
  })
    .then(function (veiculos) {
      if (veiculos)
        return res.jsonOK({
          data: veiculos,
          status: 200,
          message: "Veículos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os veículos",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os veículos",
      });
    });
});

router.put("/:id/veiculo/:vehicleId", async (req, res) => {
  const { id } = req.params;
  await User.findAll({
    include: [
      {
        model: Vehicle,
        as: "vehicle",
        required: false,
      },
    ],
    where: {
      id,
    },
  })
    .then(function (veiculos) {
      if (veiculos)
        return res.jsonOK({
          data: veiculos,
          status: 200,
          message: "Veículos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os veículos",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os veículos",
      });
    });
});

// Agenda usuário
router.post("/:id/agenda", async (req, res) => {
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

router.get("/:id/agenda", async (req, res) => {
  const { id } = req.params;

  await Schedule.findAll({
    where: { userId: id },
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

router.get("/:id/agenda/:scheduleId", async (req, res) => {
  const { id, scheduleId } = req.params;

  await Schedule.findAll({
    where: { id: scheduleId },
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

router.put("/:id/agenda/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;
  const { status } = req.body;

  await Schedule.findOne({ where: { id: scheduleId } })
    .then(async function (agendamento) {
      if (agendamento) {
        await Schedule.update(
          { status },
          {
            where: { id: scheduleId },
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

module.exports = router;
