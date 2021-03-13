"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Model",
      [
        {
          model: "Golf",
          brandId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          model: "Focus",
          brandId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          model: "Cruze",
          brandId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          model: "Civic",
          brandId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Model", null, {});
  },
};
