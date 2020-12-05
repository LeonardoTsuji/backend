"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      "roleUser",
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
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Role",
            key: "id",
          },
        },
      },
      {
        tableName: "roleUser",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("roleUser");
  },
};
