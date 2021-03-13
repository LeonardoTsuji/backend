module.exports = (sequelize, DataTypes) => {
  const ServiceOrder = sequelize.define(
    "ServiceOrder",
    {
      paid: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      done: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      notes: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      paymentMethod: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      paymentDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      userVehicleId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Vehicle",
          key: "id",
        },
      },
    },
    {
      tableName: "serviceOrder",
    }
  );

  //Relacionamentos
  ServiceOrder.associate = (models) => {
    ServiceOrder.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    ServiceOrder.belongsTo(models.Vehicle, {
      foreignKey: "userVehicleId",
      as: "vehicle",
    });
    ServiceOrder.belongsToMany(models.Product, {
      through: "serviceOrderProduct",
      as: "products",
      foreignKey: "serviceOrderId",
      otherKey: "productId",
    });
  };

  return ServiceOrder;
};
