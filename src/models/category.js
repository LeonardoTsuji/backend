module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "category",
    }
  );

  //Relacionamentos
  Category.associate = (models) => {
    Category.hasMany(models.Product);
    Category.belongsToMany(models.Product, {
      foreignKey: "categoryId",
      through: "categoryProduct",
      as: "product",
    });
  };
  return Category;
};
