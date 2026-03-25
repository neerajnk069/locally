const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('messages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    chatConstantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chatconstant',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    messageType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0=>text,1=>image,2=>video,3,audio,4=>pdf,5=>doc"
    },
    isRead: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0=>unread,1=>read"
    },
    deletedId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    paranoid: true,
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
        name: "senderId",
        using: "BTREE",
        fields: [
          { name: "senderId" },
        ]
      },
      {
        name: "receiverId",
        using: "BTREE",
        fields: [
          { name: "receiverId" },
        ]
      },
      {
        name: "chatConstantId",
        using: "BTREE",
        fields: [
          { name: "chatConstantId" },
        ]
      },
    ]
  });
};
