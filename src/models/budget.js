module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define(
    "Budget",
    {
      expirationDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      paymentMethod: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userVehicleId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      scheduleId: {
        allowNull: false,
        unique: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "budget",
    }
  );

  //Relacionamentos
  Budget.associate = (models) => {
    Budget.belongsToMany(models.Product, {
      through: "budgetProduct",
      as: "products",
      foreignKey: "budgetId",
      otherKey: "productId",
    });
    Budget.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Budget.belongsTo(models.Vehicle, {
      foreignKey: "userVehicleId",
      as: "vehicle",
    });
    Budget.belongsTo(models.Schedule, {
      foreignKey: "scheduleId",
      as: "schedule",
    });
  };
  return Budget;
};
