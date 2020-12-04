"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "category",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        expirationDate: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        paymentMethod: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        amount: {
          allowNull: false,
          type: DataTypes.DOUBLE,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        userId: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
      },
      {
        tableName: "category",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("category");
  },
};
