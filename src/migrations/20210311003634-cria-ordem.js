"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "serviceOrder",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        paid: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
        },
        done: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
        },
        notes: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        paymentMethod: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        paymentDate: {
          allowNull: true,
          type: DataTypes.DATE,
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
          allowNull: false,
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
        tableName: "serviceOrder",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("serviceOrder");
  },
};
