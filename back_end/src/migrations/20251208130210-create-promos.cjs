'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('promos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 2025,
        },
      },      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('promos');
  }
};
