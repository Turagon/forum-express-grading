'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        isAlphanumeric: {
          msg: "Include uppercase, lowercase & number only"
        }
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        isEmail: {
          msg: "Invalid email format"
        }
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        isAlphanumeric: {
          msg: "Include uppercase, lowercase & number only"
        }
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};