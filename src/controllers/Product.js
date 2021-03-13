const express = require("express");

const { QueryTypes } = require("sequelize");

const { Product, Category, Brand, CategoryProduct } = require("../models");

const { sequelize } = require("../models/index");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, description, price, brandId, categoryId } = req.body;

  await Product.create({
    name,
    description,
    price,
    brandId,
    categoryId,
  })
    .then(function (novoProduto) {
      novoProduto.setCategory([categoryId]);
      return res.jsonOK({
        data: novoProduto,
        status: 201,
        message: "Produto cadastrado com sucesso!",
      });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        status: 400,
        data: err,
        message: "Não foi possível cadastrar o produto",
      });
    });
});

router.get("/", async (req, res) => {
  const { brandId, categoryId } = req.query;
  if (brandId && categoryId) {
    await Product.findAll({
      where: {
        brandId,
        categoryId,
      },
    })
      .then(function (produtos) {
        if (produtos)
          return res.jsonOK({
            data: produtos,
            status: 200,
            message: "Produtos encontrado com sucesso!",
          });
        return res.jsonError({
          data: null,
          status: 404,
          message: "Não foi possível encontrar os produtos",
        });
      })
      .catch(function (err) {
        console.log(err, "err");
        return res.jsonError({
          data: err,
          status: 400,
          message: "Erro ao tentar encontrar os produtos",
        });
      });
  }
  await Product.findAll()
    .then(function (produtos) {
      if (produtos)
        return res.jsonOK({
          data: produtos,
          status: 200,
          message: "Produtos encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os produtos",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os produtos",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.query;

  await Product.findByPk(id)
    .then(function (produto) {
      if (produto)
        return res.jsonOK({
          data: produto,
          status: 200,
          message: "Produto encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o produto",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o produto",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { name, description, price, idFabricante, idCategoria } = req.body;
  const { id } = req.params;

  await Product.findByPk(id)
    .then(async function (produto) {
      if (produto) {
        await Product.update(
          { name, description, price, idFabricante, idCategoria },
          {
            where: { id: produto.dataValues.id },
            returning: true,
            plain: true,
          }
        )
          .then(function (produtoAtualizado) {
            return res.jsonOK({
              data: produtoAtualizado,
              status: 200,
              message: "Produto atualizado com sucesso!",
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
        message: "Não foi possível encontrar o produto",
      });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o produto",
      });
    });
});

router.delete("/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  await Product.findByPk(id)
    .then(async function (produto) {
      if (produto) {
        await Product.destroy({
          where: { id: produto.dataValues.id },
        })
          .then(function (produtoAtualizado) {
            return res.jsonOK({
              data: produtoAtualizado,
              status: 200,
              message: "Produto excluído com sucesso!",
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
        message: "Não foi possível encontrar o produto",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o produto",
      });
    });
});

module.exports = router;
