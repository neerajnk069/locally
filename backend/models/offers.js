const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "offers",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      discount_details: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      terms_conditions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: true,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      tableName: "offers",
      timestamps: true,
      // indexes: [
      //   {
      //     name: "PRIMARY",
      //     unique: true,
      //     using: "BTREE",
      //     fields: [{ name: "id" }],
      //   },
      // {
      //   name: "merchant_id",
      //   using: "BTREE",
      //   fields: [{ name: "merchant_id" }],
      // },
      // ],
    },
  );
};
