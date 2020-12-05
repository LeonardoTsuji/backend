module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      description: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "role",
    }
  );

  return Role;
};
