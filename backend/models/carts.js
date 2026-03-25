const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "carts",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      merchant_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      offer_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      traveler_session_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "carts",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "merchant_id",
          using: "BTREE",
          fields: [{ name: "merchant_id" }],
        },
        {
          name: "offer_id",
          using: "BTREE",
          fields: [{ name: "offer_id" }],
        },
      ],
    },
  );
};
