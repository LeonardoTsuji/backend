"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "mechanicalService",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true,
        },
        description: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        price: {
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
      },
      {
        tableName: "mechanicalService",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("mechanicalService");
  },
};
