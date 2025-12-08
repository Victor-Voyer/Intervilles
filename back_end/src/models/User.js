'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Promo, {
        foreignKey: 'promo_id',
        as: 'promo',
      });
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
      User.hasMany(models.Comment, {
        foreignKey: 'user_id',
        as: 'comments',
      });
      User.hasMany(models.Participation, {
        foreignKey: 'user_id',
        as: 'participations',
      });
      User.hasMany(models.ChatMessage, {
        foreignKey: 'user_id',
        as: 'chat_messages',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      promo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'promos',
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      validated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  return User;
};
