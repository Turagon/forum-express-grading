'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'admin', 'isAdmin')
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'isAdmin', 'admin')
  }
};
