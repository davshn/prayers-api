const { DataTypes,Model } = require("sequelize");

module.exports = (sequelize) => {
    // Table model defined
    class Comments extends Model { }

    Comments.init(   
        {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
        sequelize,
        modelName: "comment",
        tableName: "comments",
        timestamps: true,
    }
  );
};