"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "serviceOrderProduct",
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
        serviceOrderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "ServiceOrder",
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
        tableName: "serviceOrderProduct",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("serviceOrderProduct");
  },
};
