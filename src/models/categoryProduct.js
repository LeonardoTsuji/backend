module.exports = (sequelize, DataTypes) => {
  const CategoryProduct = sequelize.define(
    "CategoryProduct",
    {
      productId: {
        type: DataTypes.INTEGER,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "categoryProduct",
    }
  );

  //Relacionamentos
  CategoryProduct.associate = function (models) {
    CategoryProduct.belongsToMany(models.Category, {
      foreignKey: "categoryId",
      through: "categoryProduct",
    });
    CategoryProduct.belongsToMany(models.Product, {
      foreignKey: "productId",
      through: "categoryProduct",
    });
  };
  return CategoryProduct;
};
