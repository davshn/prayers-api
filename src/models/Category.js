const { DataTypes,Model } = require("sequelize");

module.exports = (sequelize) => {
    // Table model defined
    class Categories extends Model { }

    Categories.init(   
        {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
        sequelize,
        modelName: "category",
        tableName: "categories",
        timestamps: false,
    }
  );
};