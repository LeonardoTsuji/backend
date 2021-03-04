"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Product",
      [
        {
          name: "Pastilha de freio",
          description: "",
          categoryId: 1,
          price: 100,
          brandId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Filtro de ar",
          description: "",
          price: 100,
          categoryId: 2,
          brandId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bomba de água",
          description: "",
          price: 100,
          categoryId: 3,
          brandId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kit Amortecedor",
          description: "",
          price: 100,
          categoryId: 4,
          brandId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Product", null, {});
  },
};
