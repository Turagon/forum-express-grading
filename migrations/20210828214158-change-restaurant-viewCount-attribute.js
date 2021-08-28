'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Restaurants', 'viewCounts', {
      type: Sequelize.INTEGER,
      default: 0
    })
  },

  down: async (queryInterface, Sequelize) => {

  }
};
