const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const Op = Sequelize.Op; // biblioteca de operadores

const express = require("express");
const router = express.Router();
const { verifyJwt } = require("../helpers/jwt");

const {
  ServiceOrder,
  Product,
  ServiceOrderProduct,
  Budget,
} = require("../models");

router.post("/", verifyJwt, async (req, res) => {
  const {
    paid,
    done,
    notes,
    paymentMethod,
    paymentDate,
    userId,
    userVehicleId,
    products,
    bugdetId,
  } = req.body;

  let savedServiceOrder;

  try {
    savedServiceOrder = await ServiceOrder.create({
      paid,
      done,
      notes,
      paymentMethod,
      paymentDate,
      userId,
      userVehicleId,
    });

    const budget = await Budget.findByPk(bugdetId);

    if (budget)
      await Budget.update(
        {
          status: "FINALIZADO",
        },
        { where: { id: bugdetId } }
      );
  } catch (err) {
    return res.jsonError({
      data: err,
      status: 400,
      message: "Erro ao gerar ordem de serviço",
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
        serviceOrderId: savedServiceOrder.dataValues.id,
        productId: item.productId,
        quantity: item.quantity,
      };

      await ServiceOrderProduct.create(po, { w: 1 }, { returning: true });
    });

    Promise.all(await promisesProducts);
  }

  return res.jsonOK({
    data: savedServiceOrder,
    status: 201,
    message: "Ordem de serviço criada com sucesso!",
  });
});

router.get("/", verifyJwt, async (req, res) => {
  const { userId } = req.query;

  if (userId) {
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
      where: { userId },
    })
      .then(function (orcamentos) {
        if (orcamentos)
          return res.jsonOK({
            data: orcamentos,
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
        console.error(err, "err");
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar a ordem de serviço",
        });
      });
  }

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
  })
    .then(function (orcamentos) {
      if (orcamentos)
        return res.jsonOK({
          data: orcamentos,
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
});

router.get("/:id", verifyJwt, async (req, res) => {
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
    where: { id },
  })
    .then(function (orcamentos) {
      if (orcamentos)
        return res.jsonOK({
          data: orcamentos,
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
});

router.put("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const {
    paid,
    done,
    notes,
    paymentDate,
    paymentMethod,
    userId,
    userVehicleId,
    products,
  } = req.body;

  const serviceOrder = await ServiceOrder.findByPk(id);

  if (!serviceOrder)
    return res.jsonError({
      data: null,
      status: 404,
      message: "Não foi possível encontrar a ordem de serviço",
    });

  const allProducts = await serviceOrder.getProducts();
  serviceOrder.removeProducts(allProducts);

  if (products) {
    const promisesProducts = products.map(async (item) => {
      const po = {
        serviceOrderId: id,
        productId: item.productId,
        quantity: item.quantity,
      };

      await ServiceOrderProduct.create(po, { w: 1 }, { returning: true });

      try {
        await Promise.all(promisesProducts);
      } catch (err) {
        console.log(err, "errrrr");
      }
    });
  }

  const updatedServiceOrder = await ServiceOrder.update(
    {
      paid,
      done,
      notes,
      paymentDate,
      paymentMethod,
      userId,
      userVehicleId,
    },
    { where: { id } }
  );

  if (!updatedServiceOrder) {
    return res.jsonError({
      data: null,
      status: 400,
      message: "Erro ao atualizar a ordem de serviço",
    });
  }

  return res.jsonOK({
    data: updatedServiceOrder,
    status: 200,
    message: "Ordem de serviço atualizada com sucesso!",
  });
});

router.delete("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

  const serviceOrder = await ServiceOrder.findByPk(id);

  if (!serviceOrder) {
    return res.jsonError({
      data: null,
      status: 404,
      message: "Não foi possível encontrar a ordem de serviço",
    });
  }

  const deletedOrder = await ServiceOrder.update(
    {
      status: "Cancelado",
    },
    { where: { id } }
  );

  if (deletedOrder) {
    return res.jsonOK({
      data: deletedOrder,
      status: 200,
      message: "Ordem de serviço deletada com sucesso!",
    });
  }

  return res.jsonError({
    data: null,
    status: 400,
    message: "Erro ao deletar a ordem de serviço",
  });
});

router.get("/:id/estatistica", verifyJwt, async (req, res) => {
  const { paid, done } = req.query;

  if (paid || done) {
    await ServiceOrder.count({
      where: {
        [Op.and]: [
          done && {
            done,
          },
          paid && { paid },
        ],
      },
    })
      .then(function (orcamentos) {
        return res.jsonOK({
          data: { count: orcamentos },
          status: 200,
          message: "Ordem de serviço encontrada com sucesso!",
        });
      })
      .catch(function (err) {
        console.error(err, "err");
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar a ordem de serviço",
        });
      });
  }

  await ServiceOrder.count()
    .then(function (orcamentos) {
      return res.jsonOK({
        data: { count: orcamentos },
        status: 200,
        message: "Ordem de serviço encontrada com sucesso!",
      });
    })
    .catch(function (err) {
      console.error(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar a ordem de serviço",
      });
    });
});

router.get("/:id/estatistica/mes", verifyJwt, async (req, res) => {
  await ServiceOrder.findAll({
    attributes: [
      [sequelize.fn("COUNT", "*"), "quantity"],
      [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
    ],
    group: [[sequelize.fn("MONTH", sequelize.col("createdAt")), "month"]],
  })
    .then(function (ordemServico) {
      return res.jsonOK({
        data: { count: ordemServico },
        status: 200,
        message: "Ordem de serviço encontrada com sucesso!",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar a ardem de serviço",
      });
    });
});

module.exports = router;
