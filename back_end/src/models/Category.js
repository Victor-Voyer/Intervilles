'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Challenge, {
        foreignKey: 'category_id',
        as: 'challenges',
      });
    }
  }
  Category.init(
    {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
  );
  return Category;
}