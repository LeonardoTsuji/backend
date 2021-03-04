"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "budget",
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
        status: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        userId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: "User",
            key: "id",
          },
        },
        userVehicleId: {
          type: DataTypes.INTEGER,
          references: {
            model: "Vehicle",
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
        tableName: "budget",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("budget");
  },
};
