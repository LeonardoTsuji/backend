/**
 * @swagger
 * definitions:
 *   Brand:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 */

module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    "Brand",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "brand",
    }
  );

  //Relacionamentos
  Brand.associate = (models) => {
    Brand.hasMany(models.Product, {
      as: "products",
      foreignKey: "id",
    });
  };
  return Brand;
};
