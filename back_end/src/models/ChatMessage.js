'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    static associate(models) {
      ChatMessage.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      ChatMessage.belongsTo(models.Promo, {
        foreignKey: 'promo_id',
        as: 'promo',
      });
    }
  }
  ChatMessage.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
          model: 'users',
          key: 'id', 
        },
      },
      promo_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'promos', key: 'id' },
      },
      scope: {
        type: DataTypes.ENUM('global', 'promo'),
        allowNull: false,
        defaultValue: 'global',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChatMessage',
      tableName: 'chat_messages',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return ChatMessage;
};