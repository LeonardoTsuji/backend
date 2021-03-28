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
  ServiceOrder,
  ServiceOrderProduct,
  Model,
  Brand,
} = require("../models");

const SendEmail = require("./SendMail");

const router = express.Router();

const saltRounds = 10;

router.post("/", async (req, res) => {
  const { email, password, name, phone, roleId } = req.body;

  await User.findOne({ where: { email, active: true } })
    .then(async function (account) {
      if (account)
        return res.jsonError({
          data: null,
          status: 400,
          message: "E-mail já cadastrado",
        });

      const hash = bcrypt.hashSync(password, saltRounds);

      await User.create({
        email,
        phone,
        name,
        password: hash,
        roleId,
        active: true,
      })
        .then(function (newUser) {
          if (!newUser) {
            return res.jsonError({
              status: 404,
              data: err,
              message: "Não foi possível encontrar o perfil de usuário!",
            });
          }

          const token = generateJwt({ id: newUser.id });
          const refreshToken = generateRefreshJwt({
            id: newUser.id,
            version: newUser.jwtVersion,
          });

          req.body.login = email;
          req.body.password = password;
          req.body.subject = "Premium Car Bauru - Primeiro Login";

          SendEmail.sendUserEmail(req, "login");

          return res.jsonOK({
            data: newUser,
            status: 201,
            message: "Cadastro efetuado com sucesso!",
            metadata: { token, refreshToken },
          });
        })
        .catch(function (err) {
          console.log(err, "err");
          return res.jsonError({
            status: 400,
            data: err,
            message: "Erro ao criar o usuário",
          });
        });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao criar o usuário",
      });
    });
});

router.get("/", verifyJwt, async (req, res) => {
  const { role } = req.query;
  if (role)
    await User.findAll({
      include: {
        model: Role,
        as: "role",
      },
      where: { roleId: role, active: true },
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

  await User.findAll({
    include: {
      model: Role,
      as: "role",
    },
    where: { active: true },
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

router.get("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  await User.findOne({ where: { email, active: true } })
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

router.put("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, roleId, active } = req.body;

  if (!roleId)
    return res.jsonError({
      data: null,
      status: 400,
      message: "É necessário informar a regra do usuário",
    });

  await User.findByPk(id)
    .then(async function (account) {
      if (!account) {
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar o usuário",
        });
      }

      await User.findOne({ where: { email } })
        .then(async function (user) {
          if (user.dataValues.email !== email)
            return res.jsonError({
              data: null,
              status: 400,
              message: "E-mail já cadastrado!",
            });

          await User.update(
            { name, email, phone, roleId, active },
            {
              where: { id },
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
        })
        .catch(function (err) {
          console.log(err);
          return res.jsonError({
            data: err,
            status: 400,
            message: "Informe o e-mail!",
          });
        });
    })
    .catch(function (err) {
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o usuário",
      });
    });
});

router.delete("/:id", verifyJwt, async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  if (email)
    await User.findOne({ where: { email } })
      .then(async function (account) {
        if (account) {
          await User.update(
            {
              active: false,
            },
            {
              where: { id: account.dataValues.id },
            }
          )
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

  await User.findByPk(id)
    .then(async function (account) {
      if (account) {
        await User.update(
          {
            active: false,
          },
          {
            where: { id: account.dataValues.id },
          }
        )
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
router.post("/:id/orcamento", verifyJwt, async (req, res) => {
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

router.put("/:id/orcamento/:budgetId", verifyJwt, async (req, res) => {
  const { budgetId } = req.params;

  const { paymentMethod, status } = req.body;

  const budget = await Budget.findByPk(budgetId);

  if (!budget)
    return res.jsonError({
      data: null,
      status: 404,
      message: "Não foi possível encontrar o orçamento",
    });

  await Budget.update(
    {
      paymentMethod,
      status,
    },
    { where: { id: budgetId } }
  )
    .then(function (updatedBudget) {
      return res.jsonOK({
        data: updatedBudget,
        status: 200,
        message: "Orçamento atualizado com sucesso!",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao atualizar o orçamento",
      });
    });
});

router.get("/:id/orcamento", verifyJwt, async (req, res) => {
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

router.get("/:id/orcamento/:budgetId/valor", verifyJwt, async (req, res) => {
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
router.post("/:id/veiculo", verifyJwt, async (req, res) => {
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

router.get("/:id/veiculo", verifyJwt, async (req, res) => {
  const { id } = req.params;
  await User.findAll({
    include: [
      {
        model: Vehicle,
        as: "vehicle",
        required: false,
        include: [{ model: Model, as: "model", attributes: ["model"] }],
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

router.get("/:id/veiculo/:vehicleId", verifyJwt, async (req, res) => {
  const { id, vehicleId } = req.params;
  await User.findAll({
    include: [
      {
        model: Vehicle,
        as: "vehicle",
        required: false,
        include: [{ model: Model, as: "model", attributes: ["model"] }],
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

router.put("/:id/veiculo/:vehicleId", verifyJwt, async (req, res) => {
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
router.post("/:id/agenda", verifyJwt, async (req, res) => {
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

router.get("/:id/agenda", verifyJwt, async (req, res) => {
  const { id } = req.params;

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

router.get("/:id/agenda/:scheduleId", verifyJwt, async (req, res) => {
  const { id, scheduleId } = req.params;

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

router.put("/:id/agenda/:scheduleId", verifyJwt, async (req, res) => {
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

//Ordem serviço

router.get("/:id/ordem-servico", verifyJwt, async (req, res) => {
  const { id } = req.params;

  await ServiceOrder.findAll({
    include: [
      {
        model: Product,
        as: "products",
        required: false,
        through: {
          // This block of code allows you to retrieve the properties of the join table
          model: ServiceOrderProduct,
          as: "serviceOrderProduct",
          attributes: ["quantity"],
        },
      },
    ],
    where: { userId: id },
  })
    .then(function (ordemServico) {
      return res.jsonOK({
        data: ordemServico,
        status: 200,
        message: "Ordem de serviço encontrada com sucesso!",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar a ordem de serviço",
      });
    });
});

router.get(
  "/:id/ordem-servico/:serviceOrderId",
  verifyJwt,
  async (req, res) => {
    const { id, serviceOrderId } = req.params;

    await ServiceOrder.findAll({
      include: [
        {
          model: Product,
          as: "products",
          required: false,
          attributes: [],
          through: {
            // This block of code allows you to retrieve the properties of the join table
            model: ServiceOrderProduct,
            as: "serviceOrderProduct",
            attributes: ["quantity"],
            where: { serviceOrderId },
          },
        },
      ],
      raw: true,
      where: { userId: id },
    })
      .then(function (ordemServico) {
        if (ordemServico && ordemServico.length > 0)
          return res.jsonOK({
            data: ordemServico[0],
            status: 200,
            message: "Ordem de serviço encontrada com sucesso!",
          });
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar a ordem de serviço",
        });
      })
      .catch(function (err) {
        console.log(err, "err");
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar a ordem de serviço",
        });
      });
  }
);

router.get(
  "/:id/ordem-servico/:serviceOrderId/valor",
  verifyJwt,
  async (req, res) => {
    const { id, serviceOrderId } = req.params;

    await ServiceOrder.findAll({
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
            model: ServiceOrderProduct,
            as: "serviceOrderProduct",
            attributes: ["quantity"],
            where: { serviceOrderId },
          },
        },
      ],
      raw: true,
      where: { userId: id },
    })
      .then(function (ordemServico) {
        if (ordemServico && ordemServico.length > 0)
          return res.jsonOK({
            data: ordemServico[0],
            status: 200,
            message: "Ordem de serviço encontrada com sucesso!",
          });
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar a ordem de serviço",
        });
      })
      .catch(function (err) {
        console.log(err, "err");
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar a ordem de serviço",
        });
      });
  }
);

router.put(
  "/:id/ordem-servico/:serviceOrderId",
  verifyJwt,
  async (req, res) => {
    const { id, serviceOrderId } = req.params;
    const { paid, done, notes, paymentDate, paymentMethod } = req.body;

    const serviceOrder = await ServiceOrder.findByPk(serviceOrderId);

    if (!serviceOrder)
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar a ordem de serviço",
      });

    await ServiceOrder.update(
      {
        paid,
        done,
        notes,
        paymentDate,
        paymentMethod,
      },
      { where: { id: serviceOrderId } }
    )
      .then(function (serviceOrderUpdated) {
        return res.jsonOK({
          data: serviceOrderUpdated,
          status: 200,
          message: "Ordem de serviço atualizada com sucesso!",
        });
      })
      .catch(function (err) {
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao atualizar a ordem de serviço",
        });
      });
  }
);

module.exports = router;
