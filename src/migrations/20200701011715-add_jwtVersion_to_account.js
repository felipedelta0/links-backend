'use strict';

const { query } = require("express");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('Accounts', 'jwtVersion', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'password',
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('Accounts', 'jwtVersion')
  }
};
