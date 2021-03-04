"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "resourceRole",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        resourceId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Resource",
            key: "id",
          },
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Role",
            key: "id",
          },
        },
        permission: {
          allowNull: false,
          type: DataTypes.STRING,
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
        tableName: "resourceRole",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("resourceRole");
  },
};
