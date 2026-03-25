const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ratings', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    merchant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    traveler_session_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ratings',
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
        name: "merchant_id",
        using: "BTREE",
        fields: [
          { name: "merchant_id" },
        ]
      },
      {
        name: "traveler_session_id",
        using: "BTREE",
        fields: [
          { name: "traveler_session_id" },
        ]
      },
    ]
  });
};
