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
      categoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Category",
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
      through: "budgetProduct",
      as: "budget",
      foreignKey: "productId",
      otherKey: "budgetId",
    });
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
  };
  return Product;
};
