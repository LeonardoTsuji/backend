module.exports = (sequelize, DataTypes) => {
  const MechanicalService = sequelize.define(
    "MechanicalService",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
    },
    {
      tableName: "mechanicalService",
    }
  );

  return MechanicalService;
};
