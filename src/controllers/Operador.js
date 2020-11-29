const express = require("express");
const bcrypt = require("bcrypt");

const { Operator } = require("../models");

const router = express.Router();

const saltRounds = 10;

router.post("/", async (req, res) => {
  const { email, password, name, phone } = req.body;

  await Operator.findOne({ where: { email } })
    .then(async function (account) {
      if (account)
        return res.jsonError({
          data: null,
          status: 400,
          message: "E-mail já cadastrado",
        });

      const hash = bcrypt.hashSync(password, saltRounds);
      await Operator.create({
        email,
        phone,
        name,
        password: hash,
        administrador: "N",
      })
        .then(function (newUsuario) {
          return res.jsonOK({
            data: newUsuario,
            status: 201,
            message: "Cadastro efetuado com sucesso!",
          });
        })
        .catch(function (err) {
          return res.jsonError({
            status: 400,
            data: err,
            message: "Não foi possível criar o usuário",
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
  await Operator.findAll()
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

  await Operator.findOne({ where: { email } })
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
  const { name, email, phone, password } = req.body;

  await Operator.findOne({ where: { email } })
    .then(async function (account) {
      if (account) {
        await Operator.update(
          { name, email, password, phone },
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

  await Operator.findOne({ where: { email } })
    .then(async function (account) {
      console.log(account);
      if (account) {
        await Operator.destroy({
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

router.post("/vinculo", async (req, res) => {
  const { idOperador, vinculo } = req.body;
  await Operator.findOne({ where: { id: idOperador } })
    .then(async function (account) {
      if (account) {
        if (vinculo === "BENEFICIARIO") {
          await OperadorUsuario.create({
            id: idOperador,
            idUsuario,
          });
        }
      }
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao criar um vínculo",
      });
    });
});

router.get("/vinculo", async (req, res) => {
  const { idOperador, vinculo } = req.body;
  await Operator.findOne({ where: { id: idOperador } })
    .then(async function (account) {
      if (account) {
        if (vinculo === "BENEFICIARIO") {
          await OperadorUsuario.findOne({
            id: idOperador,
            idUsuario,
          });
        }
      }
    })
    .catch(function (err) {
      return res.jsonError({
        data: err,
        status: 400,
        message: "Erro ao encontrar um vínculo",
      });
    });
});

module.exports = router;
