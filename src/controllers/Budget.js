const Sequelize = require("sequelize");
const Op = Sequelize.Op; // biblioteca de operadores
const { sequelize } = require("../models/index");

const express = require("express");
const router = express.Router();

const { verifyJwt } = require("../helpers/jwt");
const {
  Budget,
  Product,
  BudgetProduct,
  Vehicle,
  Model,
  Brand,
  User,
  Schedule,
} = require("../models");

router.post("/", verifyJwt, async (req, res) => {
  const {
    expirationDate,
    paymentMethod,
    userId,
    products,
    userVehicleId,
    scheduleId,
  } = req.body;

  let savedBudget = null;

  try {
    savedBudget = await Budget.create({
      expirationDate: expirationDate || new Date(),
      paymentMethod,
      status: "PENDENTE",
      userId,
      userVehicleId,
      scheduleId,
    });

    await Schedule.update(
      {
        status: "FINALIZADO",
      },
      { where: { id: scheduleId } }
    );
  } catch (err) {
    return res.jsonError({
      data: err,
      status: 400,
      message: "Erro ao cadastrar o orçamentos",
    });
  }

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
    status: 201,
    message: "Orçamento criado com sucesso!",
  });
});

router.get("/", verifyJwt, async (req, res) => {
  const { userId, status } = req.query;

  if (userId || status) {
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
      where: {
        [Op.and]: [
          userId && {
            userId,
          },
          status && { status },
        ],
      },
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
        console.error(err, "err");
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

router.get("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

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
    where: { id },
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

router.put("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const {
    expirationDate,
    paymentMethod,
    status,
    userId,
    products,
    userVehicleId,
  } = req.body;

  const budget = await Budget.findByPk(id);

  if (!budget)
    return res.jsonError({
      data: null,
      status: 404,
      message: "Não foi possível encontrar o orçamento",
    });

  const allProducts = await budget.getProducts();
  budget.removeProducts(allProducts);

  if (products) {
    const promisesProducts = products.map(async (item) => {
      const po = {
        budgetId: id,
        productId: item.productId,
        quantity: item.quantity,
      };

      await BudgetProduct.create(po, { w: 1 }, { returning: true });

      try {
        await Promise.all(promisesProducts);
      } catch (err) {
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao atualizar o orçamento",
        });
      }
    });
  }

  await Budget.update(
    {
      expirationDate: expirationDate || new Date(),
      paymentMethod,
      status,
      userId,
      userVehicleId,
    },
    { where: { id } }
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

router.delete("/:id", verifyJwt, async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const budget = await Budget.findByPk(id);

  if (!budget) {
    return res.jsonError({
      data: null,
      status: 404,
      message: "Não foi possível encontrar o orçamento",
    });
  }

  const deletedOrder = await Budget.update(
    {
      status: "RECUSADO",
    },
    { where: { id } }
  );

  if (deletedOrder) {
    return res.jsonOK({
      data: deletedOrder,
      status: 200,
      message: "Orçamento deletado com sucesso!",
    });
  }

  return res.jsonError({
    data: null,
    status: 400,
    message: "Erro ao deletar o orçamento",
  });
});

router.get("/:id/estatistica", verifyJwt, async (req, res) => {
  const { status } = req.query;

  if (status !== null || status !== undefined) {
    await Budget.count({
      where: { status },
    })
      .then(function (orcamentos) {
        return res.jsonOK({
          data: { count: orcamentos },
          status: 200,
          message: "Orçamentos encontrado com sucesso!",
        });
      })
      .catch(function (err) {
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar os orçamentos",
        });
      });
  }

  await Budget.count()
    .then(function (orcamentos) {
      return res.jsonOK({
        data: { count: orcamentos },
        status: 200,
        message: "Orçamentos encontrado com sucesso!",
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

router.get("/:id/estatistica/mes", verifyJwt, async (req, res) => {
  await Budget.findAll({
    attributes: [
      [sequelize.fn("COUNT", "*"), "quantity"],
      [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
    ],
    group: [[sequelize.fn("MONTH", sequelize.col("createdAt")), "month"]],
  })
    .then(function (orcamentos) {
      return res.jsonOK({
        data: { count: orcamentos },
        status: 200,
        message: "Orçamentos encontrado com sucesso!",
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

module.exports = router;
