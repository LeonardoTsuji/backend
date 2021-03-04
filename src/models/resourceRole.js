module.exports = (sequelize, DataTypes) => {
  const ResourceRole = sequelize.define(
    "ResourceRole",
    {
      resourceId: {
        allowNull: false,
        type: DataTypes.NUMBER,
      },
      roleId: {
        allowNull: false,
        type: DataTypes.NUMBER,
      },
      permission: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "resourceRole",
    }
  );

  //Relacionamentos
  ResourceRole.associate = function (models) {
    ResourceRole.belongsToMany(models.Role, {
      through: "resourceRole",
      foreignKey: "roleId",
    });
    ResourceRole.belongsToMany(models.Resource, {
      through: "resourceRole",
      foreignKey: "resourceId",
    });
  };

  return ResourceRole;
};
