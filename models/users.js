'use strict';
const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: {
          msg: 'Include uppercase, lowercase & number only'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCreate: async (User, next) => {
        const password = User.dataValues.password
        try {
          const salt = await bcrypt.genSalt(10)
          User.dataValues.password = await bcrypt.hash(password, salt)
        }
        catch (error) {
          console.log(error)
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};