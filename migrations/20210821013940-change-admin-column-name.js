'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'admin', 'isAdmin')
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'isAdmin', 'admin')
  }
};
