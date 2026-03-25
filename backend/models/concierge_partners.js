const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "concierge_partners",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      concierge_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      merchant_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "concierge_partners",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "concierge_id",
          unique: true,
          using: "BTREE",
          fields: [{ name: "concierge_id" }, { name: "merchant_id" }],
        },
        {
          name: "merchant_id",
          using: "BTREE",
          fields: [{ name: "merchant_id" }],
        },
      ],
    },
  );
};
