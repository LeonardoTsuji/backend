"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Role",
      [
        {
          name: "ADM",
          description: "Adm do sistema",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "OPERADOR",
          description: "Operador do sistema",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "USUARIO",
          description: "Usuário do sistema",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Role", null, {});
  },
};
