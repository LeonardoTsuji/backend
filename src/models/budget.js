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
      amount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
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
    },
    {
      tableName: "budget",
    }
  );

  //Relacionamentos
  Budget.associate = (models) => {
    Budget.belongsToMany(models.Product, {
      foreignKey: "productId",
      constraint: true,
      otherKey: "budgetId",
      through: "budgetProduct",
      as: "products",
    });
    Budget.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };
  return Budget;
};
