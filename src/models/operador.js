module.exports = (sequelize, DataTypes) => {
  const Operator = sequelize.define(
    "Operator",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      admin: DataTypes.STRING,
    },
    {
      tableName: "operator",
    }
  );

  return Operator;
};
