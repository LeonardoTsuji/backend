"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Vehicle",
      [
        {
          plate: "EKT-4011",
          color: "Preto",
          kilometer: 20000,
          year: 2021,
          brandId: 1,
          modelId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plate: "DWF-4011",
          color: "Branco",
          kilometer: 20000,
          year: 2021,
          brandId: 2,
          modelId: 2,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plate: "ART-4011",
          color: "Preto",
          kilometer: 20000,
          year: 2021,
          brandId: 3,
          modelId: 3,
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plate: "HGE-4011",
          color: "Preto",
          kilometer: 20000,
          year: 2021,
          brandId: 4,
          modelId: 4,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Vehicle", null, {});
  },
};
