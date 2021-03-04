"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "vehicle",
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
        plate: {
          allowNull: true,
          type: DataTypes.STRING,
          unique: true,
        },
        color: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        kilometer: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        year: {
          allowNull: false,
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
        tableName: "vehicle",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("vehicle");
  },
};
