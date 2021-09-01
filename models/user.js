'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Comment)
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'UserId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Comment,
        foreignKey: 'UserId',
        as: 'CommentedRestaurants'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    image: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: async (User, next) => {
        const password = User.dataValues.password
        if (password) {
          try {
            const salt = await bcrypt.genSalt(10)
            User.dataValues.password = await bcrypt.hash(password, salt)
          }
          catch (error) {
            console.log(error)
          }
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};