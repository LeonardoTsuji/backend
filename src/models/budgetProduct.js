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
        references: "Product",
        referencesKey: "id",
      },
      budgetId: {
        type: DataTypes.INTEGER,
        references: "Budget",
        referencesKey: "id",
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
