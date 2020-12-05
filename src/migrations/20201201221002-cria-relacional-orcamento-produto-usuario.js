"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "budgetProduct",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        budgetId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Budget",
            key: "id",
          },
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Product",
            key: "id",
          },
        },
      },
      {
        tableName: "budgetProduct",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("budgetProduct");
  },
};
