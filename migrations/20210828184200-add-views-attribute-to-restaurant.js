'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'views', {
      type: Sequelize.INTEGER
    });
  },
  down: async (queryInterface, Sequelize) => {
    
  }
};
