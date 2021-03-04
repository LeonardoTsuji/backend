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
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
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
