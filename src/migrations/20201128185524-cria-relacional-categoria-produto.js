"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "categoryProduct",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Product",
            key: "id",
          },
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Category",
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
        tableName: "categoryProduct",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("categoryProduct");
  },
};
