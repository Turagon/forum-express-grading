'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Restaurants', 'views', 'viewCounts')
  },

  down: async (queryInterface, Sequelize) => {

  }
};
