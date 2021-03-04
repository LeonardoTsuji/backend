"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "schedule",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        dateSchedule: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        hourSchedule: {
          allowNull: false,
          type: DataTypes.TIME,
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
        tableName: "schedule",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("schedule");
  },
};
