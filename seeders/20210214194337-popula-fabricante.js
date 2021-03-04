"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Brand",
      [
        {
          name: "Volkswagen",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ford",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chevrolet",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Honda",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Brand", null, {});
  },
};
