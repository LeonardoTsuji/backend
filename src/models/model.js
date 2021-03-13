module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "Model",
    {
      model: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      brandId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Brand",
          key: "id",
        },
      },
    },
    {
      tableName: "model",
    }
  );

  Model.associate = (models) => {
    Model.belongsTo(models.Brand, {
      foreignKey: "brandId",
      as: "brand",
    });
  };

  return Model;
};
