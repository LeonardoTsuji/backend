module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "role",
    }
  );

  //Relacionamentos
  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "user",
    });
    Role.belongsToMany(models.Resource, {
      foreignKey: "roleId",
      through: "resourceRole",
      as: "resource",
    });
  };

  return Role;
};
