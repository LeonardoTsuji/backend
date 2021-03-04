module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define(
    "Resource",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "resource",
    }
  );

  //Relacionamentos
  Resource.associate = (models) => {
    Resource.belongsToMany(models.Role, {
      foreignKey: "resourceId",
      through: "resourceRole",
      as: "role",
    });
  };

  return Resource;
};
