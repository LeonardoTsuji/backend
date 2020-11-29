"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "opertadorUser",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "User",
            key: "id",
          },
        },
        operatorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Operator",
            key: "id",
          },
        },
      },
      {
        tableName: "opertadorUser",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("opertadorUser");
  },
};
