module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      brandId: {
        allowNull: false,
        type: DataTypes.NUMBER,
        references: {
          model: "Brand",
          key: "id",
        },
      },
    },
    {
      tableName: "product",
    }
  );

  //Relacionamentos

  Product.associate = (models) => {
    Product.belongsTo(models.Brand, {
      foreignKey: "brandId",
      as: "brand",
    });
    Product.belongsToMany(models.Budget, {
      foreignKey: "budgetId",
      as: "budget",
      constraint: true,
      otherKey: "productId",
      through: "budgetProduct",
    });
    Product.belongsToMany(models.Category, {
      foreignKey: "productId",
      constraint: true,
      otherKey: "categoryId",
      through: "categoryProduct",
      as: "category",
    });
  };
  return Product;
};
