'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'password', {
        allowNull: false,
        type: Sequelize.STRING,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'password', {
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    })
  }
};
