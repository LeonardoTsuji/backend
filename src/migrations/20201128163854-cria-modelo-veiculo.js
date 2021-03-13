"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "model",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        model: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        brandId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: "Brand",
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
        tableName: "model",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("model");
  },
};
