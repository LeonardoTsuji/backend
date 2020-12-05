module.exports = (sequelize, DataTypes) => {
  const CategoryProduct = sequelize.define(
    "CategoryProduct",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
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
    CategoryProduct.belongsTo(models.Category, {
      foreignKey: "productId",
      targetKey: "id",
    });
    CategoryProduct.belongsTo(models.Product, {
      foreignKey: "categoryId",
      targetKey: "id",
    });
  };
  return CategoryProduct;
};
