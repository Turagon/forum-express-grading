'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      len: [1, 100]
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      len: [1, 25]
    })
  }
};
