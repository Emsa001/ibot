const { DataTypes, Model } = require("sequelize");

module.exports = class config extends Model {
  static init(sequelize) {
    return super.init(
      {
        configId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userName: { type: DataTypes.STRING },
        userID: { type: DataTypes.STRING },
        guildID: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        content: { type: DataTypes.STRING },
      },
      {
        tableName: "userDB",
        timestamps: true,
        sequelize,
      }
    );
  }
};
