const express = require("express");

const { Category } = require("../models");

const router = express.Router();
const { verifyJwt } = require("../helpers/jwt");

router.post("/", verifyJwt, async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.jsonError({
      status: 400,
      data: null,
      message: "É necessário preencher a categoria",
    });

  await Category.findOne({ where: { name } })
    .then(async function (categoria) {
      if (!categoria) {
        await Category.create({ name })
          .then(function (novoProduto) {
            return res.jsonOK({
              data: novoProduto,
              status: 201,
              message: "Categoria cadastrado com sucesso!",
            });
          })
          .catch(function (err) {
            return res.jsonError({
              status: 400,
              data: err,
              message: "Não foi possível cadastrar o categoria",
            });
          });
      }

      return res.jsonError({
        data: null,
        status: 400,
        message: "Categoria já cadastrado",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao cadastrar o categoria",
      });
    });
});

router.get("/", verifyJwt, async (req, res) => {
  await Category.findAll()
    .then(function (categorias) {
      if (categorias)
        return res.jsonOK({
          data: categorias,
          status: 200,
          message: "Categorias encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os categorias",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os categorias",
      });
    });
});

router.get("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

  await Category.findByPk(id)
    .then(function (categoria) {
      if (categoria)
        return res.jsonOK({
          data: categoria,
          status: 200,
          message: "Categoria encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o categoria",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar o categoria",
      });
    });
});

router.put("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await Category.findOne({
    where: { name },
  })
    .then(async function (categoriaAntiga) {
      if (!categoriaAntiga) {
        await Category.findByPk(id)
          .then(async function (categoria) {
            if (categoria) {
              await Category.update(
                { name },
                {
                  where: { id: categoria.dataValues.id },
                  returning: true,
                  plain: true,
                }
              )
                .then(function (categoriaAtualizada) {
                  return res.jsonOK({
                    data: categoriaAtualizada,
                    status: 200,
                    message: "Categoria atualizado com sucesso!",
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
              message: "Não foi possível encontrar o categoria",
            });
          });
      }
      return res.jsonError({
        data: null,
        status: 400,
        message: "Categoria já existe",
      });
    })
    .catch(function (err) {
      console.log(err);
      return res.jsonError({
        data: err,
        status: 404,
        message: "Não foi possível encontrar o categoria",
      });
    });
});

router.delete("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

  await Category.findByPk(id)
    .then(async function (categoria) {
      if (categoria) {
        await Category.destroy({
          where: { id: categoria.dataValues.id },
        })
          .then(function (categoriaAtualizada) {
            return res.jsonOK({
              data: categoriaAtualizada,
              status: 200,
              message: "Categoria excluída com sucesso!",
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
        message: "Não foi possível encontrar o categoria",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o categoria",
      });
    });
});

module.exports = router;
