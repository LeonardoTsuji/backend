module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    "Schedule",
    {
      dateSchedule: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      hourSchedule: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "schedule",
    }
  );

  //Relacionamentos
  Schedule.associate = (models) => {
    Schedule.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Schedule;
};
