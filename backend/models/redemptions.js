const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('redemptions', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    traveler_session_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    merchant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    offer_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    concierge_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    redemption_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','completed'),
      allowNull: true,
      defaultValue: "completed"
    }
  }, {
    sequelize,
    tableName: 'redemptions',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "traveler_session_id",
        using: "BTREE",
        fields: [
          { name: "traveler_session_id" },
        ]
      },
      {
        name: "merchant_id",
        using: "BTREE",
        fields: [
          { name: "merchant_id" },
        ]
      },
      {
        name: "offer_id",
        using: "BTREE",
        fields: [
          { name: "offer_id" },
        ]
      },
      {
        name: "concierge_id",
        using: "BTREE",
        fields: [
          { name: "concierge_id" },
        ]
      },
    ]
  });
};
