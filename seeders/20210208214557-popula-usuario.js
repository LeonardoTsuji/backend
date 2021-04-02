"use strict";

const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "User",
      [
        {
          email: "leonardo_tsuji@hotmail.com",
          password: bcrypt.hashSync("123456", saltRounds),
          name: "Leonardo",
          phone: "14998506827",
          roleId: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "fabio_tsuji@hotmail.com",
          password: bcrypt.hashSync("123456", saltRounds),
          name: "Fabio",
          phone: "14998506827",
          roleId: 2,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "leonardohkt@gmail.com",
          password: bcrypt.hashSync("123456", saltRounds),
          name: "Leonardo Hideki",
          phone: "14998506827",
          roleId: 3,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("User", null, {});
  },
};
