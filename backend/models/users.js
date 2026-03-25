const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.ENUM("0", "1", "2", "3"),
        allowNull: false,
        defaultValue: "1",
        comment: "o=>admin,1=>merchant,2=>concierge,3=>travellers",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      business_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      profile_logo: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      referral_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: "referral_code",
      },
      subscription_status: {
        type: DataTypes.ENUM("active", "suspended", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
      is_approved: {
        type: DataTypes.ENUM("pending", "approved", "disapproved"),
        allowNull: true,
      },
      forgot_password_otp: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
      },
      notification_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: false,
        defaultValue: "1",
        comment: "0=>incative,1=>active",
      },
      socketId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      tableName: "users",
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
        {
          name: "referral_code",
          unique: true,
          using: "BTREE",
          fields: [{ name: "referral_code" }],
        },
      ],
    },
  );
};
