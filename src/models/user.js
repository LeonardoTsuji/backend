module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "user",
    }
  );

  //Relacionamentos
  User.associate = (models) => {
    User.hasMany(models.Budget, {
      as: "budget",
    });
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });
    User.hasMany(models.Vehicle, {
      as: "vehicle",
    });
    User.hasMany(models.ServiceOrder, {
      as: "serviceOrder",
    });
  };

  return User;
};
