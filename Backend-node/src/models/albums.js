const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const User = require("./user");

const Album = db.define(
  "Album",
  {
    id_album: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    album_name: {
      type: DataTypes.STRING,
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
    tableName: "albums",
    timestamps: false,
  }
);
Album.belongsTo(User, { foreignKey: "id_user" });

module.exports = Album;