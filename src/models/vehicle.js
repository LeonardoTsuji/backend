module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      model: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      plate: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: true,
      },
      color: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      kilometer: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      year: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      brandId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Brand",
          key: "id",
        },
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      tableName: "vehicle",
    }
  );

  //Relacionamentos

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.Brand, {
      foreignKey: "brandId",
      as: "brand",
    });
    Vehicle.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Vehicle.hasMany(models.Budget, {
      as: "budget",
      foreignKey: "userVehicleId",
    });
  };
  return Vehicle;
};
