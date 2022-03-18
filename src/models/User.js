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
      createdPrays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdComments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      prayersToCreate: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
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
