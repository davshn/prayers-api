const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  // Table model defined
  class Prayers extends Model {}

  Prayers.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      supporters: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      profileImage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "prayer",
      tableName: "prayers",
      timestamps: true,
    }
  );
};
