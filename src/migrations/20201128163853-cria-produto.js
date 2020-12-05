"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "product",
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
          allowNull: true,
          type: DataTypes.STRING,
        },
        price: {
          allowNull: false,
          type: DataTypes.DOUBLE,
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
        tableName: "product",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("product");
  },
};
