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
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
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
  };

  return User;
};
