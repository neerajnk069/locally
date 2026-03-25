const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "merchants",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      whatsapp_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      opening_hours: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      total_profile_views: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      total_clicks: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      total_redemptions: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      total_cashback_generated: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      tableName: "merchants",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "user_id",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "category_id",
          using: "BTREE",
          fields: [{ name: "category_id" }],
        },
      ],
    },
  );
};
