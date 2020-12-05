module.exports = (sequelize, DataTypes) => {
  const BudgetProduct = sequelize.define(
    "BudgetProduct",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
      },
      budgetId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "budgetProduct",
    }
  );

  //Relacionamentos
  BudgetProduct.associate = function (models) {
    BudgetProduct.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
    BudgetProduct.belongsTo(models.Product, {
      foreignKey: "productId",
      targetKey: "id",
    });
  };
  return BudgetProduct;
};
