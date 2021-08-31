'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      // define association here
      Restaurant.belongsTo(models.Category)  // 加入關聯設定
      Restaurant.hasMany(models.Comment)  // 加入關聯設定
      Restaurant.hasMany(models.Favorite)  // 加入關聯設定
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'RestaurantId',
        as: 'FavoritedUsers'
      })
      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'RestaurantId',
        as: 'LikedUsers'
      })
    }
  };
  Restaurant.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    viewCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};