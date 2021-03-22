const express = require("express");

const { Brand } = require("../models");
const { verifyJwt } = require("../helpers/jwt");

const router = express.Router();
/**
 * @swagger
 * /api/puppies:
 *   post:
 *     tags:
 *       - Puppies
 *     description: Creates a new puppy
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: puppy
 *         description: Puppy object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Puppy'
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post("/", verifyJwt, async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.jsonError({
      status: 400,
      data: null,
      message: "É necessário preencher o fabricante",
    });

  await Brand.findOne({ where: { name } })
    .then(async function (fabricante) {
      if (!fabricante) {
        await Brand.create({ name })
          .then(function (novoFabricante) {
            return res.jsonOK({
              data: novoFabricante,
              status: 201,
              message: "Fabricante cadastrado com sucesso!",
            });
          })
          .catch(function (err) {
            return res.jsonError({
              status: 400,
              data: err,
              message: "Não foi possível cadastrar o fabricante",
            });
          });
      }

      return res.jsonError({
        data: null,
        status: 400,
        message: "Fabricante já cadastrado",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        status: 400,
        data: err,
        message: "Erro ao cadastrar o fabricante",
      });
    });
});

router.get("/", verifyJwt, async (req, res) => {
  await Brand.findAll()
    .then(function (fabricantes) {
      if (fabricantes)
        return res.jsonOK({
          data: fabricantes,
          status: 200,
          message: "Fabricantes encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar os fabricantes",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao tentar encontrar os fabricantes",
      });
    });
});

router.get("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

  await Brand.findOne({ where: { id }, include: "products" })
    .then(function (fabricante) {
      if (fabricante)
        return res.jsonOK({
          data: fabricante,
          status: 200,
          message: "Fabricante encontrado com sucesso!",
        });
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o fabricante",
      });
    })
    .catch(function (err) {
      console.log(err, "err");
      return res.jsonError({
        data: {},
        status: 400,
        message: "Erro ao encontrar o fabricante",
      });
    });
});

router.put("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await Brand.findOne({ where: { name } })
    .then(async function (fabricante) {
      if (!fabricante) {
        await Brand.findOne({ where: { id } })
          .then(async function (fabricanteEncontrado) {
            if (!fabricanteEncontrado)
              return res.jsonError({
                data: null,
                status: 404,
                message: "Não foi possível encontrar o fabricante",
              });

            await Brand.update(
              { name },
              {
                where: { id: fabricanteEncontrado.dataValues.id },
                returning: true,
                plain: true,
              }
            )
              .then(function (fabricanteAtualizado) {
                return res.jsonOK({
                  data: fabricanteAtualizado,
                  status: 200,
                  message: "Fabricante atualizado com sucesso!",
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
            return res.jsonError({
              data: null,
              status: 404,
              message: "Não foi possível encontrar o fabricante",
            });
          });
      }

      return res.jsonError({
        data: null,
        status: 400,
        message: "Fabricante já existe",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o fabricante",
      });
    });
});

router.delete("/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;

  await Brand.findOne({ where: { id } })
    .then(async function (fabricante) {
      if (fabricante) {
        await Brand.destroy({
          where: { id: fabricante.dataValues.id },
        })
          .then(function (fabricanteAtualizado) {
            return res.jsonOK({
              data: fabricanteAtualizado,
              status: 200,
              message: "Fabricante excluído com sucesso!",
            });
          })
          .catch(function (err) {
            return res.jsonError({
              data: err,
              status: 400,
              message: "Erro ao excluir o fabricante",
            });
          });
      }

      return res.jsonError({
        data: null,
        status: 404,
        message: "Não foi possível encontrar o fabricante",
      });
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar o fabricante",
      });
    });
});

module.exports = router;
