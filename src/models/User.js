const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  // Table model defined
  class Users extends Model {}

  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        allowNull: false,
        unique: true,
      },
      createdPrayers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdComments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      deviceInfo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isBaned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "user",
      tableName: "users",
      timestamps: false,
    }
  );
};
