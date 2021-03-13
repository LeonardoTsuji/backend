module.exports = (sequelize, DataTypes) => {
  const ServiceOrderProduct = sequelize.define(
    "ServiceOrderProduct",
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
      serviceOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ServiceOrder",
          key: "id",
        },
      },
    },
    {
      tableName: "serviceOrderProduct",
    }
  );

  //Relacionamentos
  ServiceOrderProduct.associate = function (models) {
    ServiceOrderProduct.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
    ServiceOrderProduct.belongsTo(models.Product, {
      foreignKey: "productId",
      targetKey: "id",
    });
  };
  return ServiceOrderProduct;
};
