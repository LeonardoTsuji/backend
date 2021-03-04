"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "MechanicalService",
      [
        {
          name: "Troca de óleo",
          description: "É feita a troca do óleo do seu motor",
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Troca de pastilhas",
          description: "É feita a troca de pastilhas de freio",
          price: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Alinhamento e balanceamento",
          description: "É feita o alinhamento e o balanceamento do carro",
          price: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("MechanicalService", null, {});
  },
};
