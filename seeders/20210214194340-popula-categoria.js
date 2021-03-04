"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Category",
      [
        {
          name: "Freio",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Filtro",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bomba",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Amortecedor",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Category", null, {});
  },
};
