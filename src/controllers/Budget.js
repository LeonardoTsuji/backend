const express = require("express");
const router = express.Router();

const { Budget, Product, BudgetProduct } = require("../models");

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (userId) {
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
      where: { userId },
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

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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
        console.log(err, "errrrr");
      }
    });
  }

  const updatedBudget = await Budget.update(
    {
      expirationDate: expirationDate || new Date(),
      paymentMethod,
      status,
      userId,
      userVehicleId,
    },
    { where: { id } }
  );

  if (!updatedBudget) {
    return res.jsonError({
      data: null,
      status: 400,
      message: "Erro ao atualizar o orçamento",
    });
  }

  return res.jsonOK({
    data: updatedBudget,
    status: 200,
    message: "Orçamento atualizado com sucesso!",
  });
});

router.delete("/:id", async (req, res) => {
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
      status: "Cancelado",
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

module.exports = router;
