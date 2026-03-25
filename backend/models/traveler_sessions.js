const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "traveler_sessions",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      concierge_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      session_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: "session_token",
      },
      ip_address: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "traveler_sessions",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "session_token",
          unique: true,
          using: "BTREE",
          fields: [{ name: "session_token" }],
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
