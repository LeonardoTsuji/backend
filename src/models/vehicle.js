module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      plate: {
        allowNull: true,
        type: DataTypes.STRING,
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
      modelId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Model",
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
    Vehicle.hasMany(models.Schedule, {
      as: "schedule",
      foreignKey: "id",
    });
    Vehicle.belongsTo(models.Model, {
      foreignKey: "modelId",
      as: "model",
    });
  };
  return Vehicle;
};
