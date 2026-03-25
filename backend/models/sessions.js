const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sessions",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        references: {
          model: "users",
          key: "id",
        },
      },
      price: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      time: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      tableName: "sessions",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "userId",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    },
  );
};
