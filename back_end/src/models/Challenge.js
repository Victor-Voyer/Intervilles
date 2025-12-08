'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Challenge extends Model {
    static associate(models) {
      Challenge.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Challenge.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });
      Challenge.hasMany(models.Participation, {
        foreignKey: 'challenge_id',
        as: 'participations',
      });
      Challenge.hasMany(models.Comment, {
        foreignKey: 'challenge_id',
        as: 'comments',
      });
    }
  }
  Challenge.init(
    {
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('open', 'in_progress', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
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
      modelName: 'Challenge',
      tableName: 'challenges',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Challenge;
};
