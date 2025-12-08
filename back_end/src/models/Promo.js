'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Promo extends Model {
    static associate(models) {
      Promo.hasMany(models.User, {
        foreignKey: 'promo_id',
        as: 'users',
      });
    }
  }
  Promo.init(
    {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2025,
            },
        },
    },
    {
        sequelize,
        modelName: 'Promo',
        tableName: 'promos',
        underscored: true,
        timestamps: false,
    }
  );
  return Promo;
}