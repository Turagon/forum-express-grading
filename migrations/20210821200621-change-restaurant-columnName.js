'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('restaurants', 'opening_hour', 'opening_hours')
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('restaurants', 'opening_hours', 'opening_hour')
  }
};
