module.exports = (sequelize, DataTypes) => {
  const RoleUser = sequelize.define(
    "RoleUser",
    {
      userId: DataTypes.NUMBER,
      roleId: DataTypes.NUMBER,
    },
    {
      tableName: "roleUser",
    }
  );

  //Relacionamentos
  RoleUser.associate = function (models) {
    RoleUser.belongsToMany(models.Role, {
      through: "roleUser",
      foreignKey: "roleId",
    });
    RoleUser.belongsToMany(models.User, {
      through: "roleUser",
      foreignKey: "userId",
    });
  };

  return RoleUser;
};
