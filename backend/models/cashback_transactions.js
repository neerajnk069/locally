const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "cashback_transactions",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      redemption_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      merchant_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      concierge_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      concierge_share: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      admin_share: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "paid"),
        allowNull: true,
        defaultValue: "pending",
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "cashback_transactions",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "redemption_id",
          using: "BTREE",
          fields: [{ name: "redemption_id" }],
        },
        {
          name: "merchant_id",
          using: "BTREE",
          fields: [{ name: "merchant_id" }],
        },
        {
          name: "concierge_id",
          using: "BTREE",
          fields: [{ name: "concierge_id" }],
        },
      ],
    },
  );
};
