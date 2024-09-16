const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const User = require("./user");
const FacialRecognition = db.define(
  "FacialRecognition",
  {
    id_facial_recognition: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    facial_image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      },
    },
  },
  {
    tableName: "facial_recognition",
    timestamps: false,
  }
);

FacialRecognition.belongsTo(User, { foreignKey: "id_user" });

module.exports = FacialRecognition;
