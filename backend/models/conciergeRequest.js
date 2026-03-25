const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "conciergerequest",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
        unique: "email",
      },
      country_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      // category: {
      //   type: DataTypes.STRING(20),
      //   allowNull: true,
      // },
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: true,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      tableName: "conciergerequest",
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
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
      ],
    },
  );
};
