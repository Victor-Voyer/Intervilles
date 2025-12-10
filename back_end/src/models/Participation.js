'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Participation extends Model {
    static associate(models) {
      Participation.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Participation.belongsTo(models.Challenge, {
        foreignKey: 'challenge_id',
        as: 'challenge',
      });
    }
  }
  Participation.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      challenge_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'challenges',
          key: 'id',
        },
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Participation',
      tableName: 'participations',
      underscored: true,
      timestamps: false,
    }
  );
  return Participation;
};