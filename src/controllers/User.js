const express = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models");

const router = express.Router();

const saltRounds = 10;

router.post("/", async (req, res) => {
  const { email, password, name, phone } = req.body;

  await User.findOne({ where: { email } })
    .then(async function (account) {
      if (account)
        return res.jsonError({
          data: null,
          status: 400,
          message: "E-mail já cadastrado",
        });

      const hash = bcrypt.hashSync(password, saltRounds);
      await User.create({ email, phone, name, password: hash })
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
  await User.findAll()
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
  const { name, email, password, phone } = req.body;

  await User.findOne({ where: { email } })
    .then(async function (account) {
      if (account) {
        await User.update(
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

  await User.findOne({ where: { email } })
    .then(async function (account) {
      console.log(account);
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

module.exports = router;
