const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const Album = require("./albums");

const Image = db.define(
  "Image",
  {
    id_image: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_album: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
            model: Album,
            key: "id_album",
        },
    },
  },
  {
    tableName: "images",
    timestamps: false,
  }
);

Image.belongsTo(Album, { foreignKey: "id_album" });

module.exports = Image;
