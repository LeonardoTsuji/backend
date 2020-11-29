module.exports = (sequelize, DataTypes) => {
  const OperatorUser = sequelize.define(
    "OperatorUser",
    {
      userId: DataTypes.NUMBER,
      operatorId: DataTypes.NUMBER,
    },
    {
      tableName: "operatorUser",
    }
  );

  //Relacionamentos
  OperatorUser.associate = function (models) {
    OperatorUser.belongsToMany(models.Operator, {
      through: "operatorUser",
      foreignKey: "operatorId",
    });
    OperatorUser.belongsToMany(models.User, {
      through: "operatorUser",
      foreignKey: "userId",
    });
  };

  return OperatorUser;
};
