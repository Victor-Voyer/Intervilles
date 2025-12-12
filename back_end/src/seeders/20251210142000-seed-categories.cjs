'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'categories',
      [
        { name: 'Technologie' },
        { name: 'Design' },
        { name: 'Marketing' },
        { name: 'Data Science' },
        { name: 'Produit' },
        { name: 'DevOps' },
        { name: 'Cybersecurite' },
        { name: 'IA & ML' },
        { name: 'IoT' },
        { name: 'Blockchain' },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'categories',
      {
        name: [
          'Technologie',
          'Design',
          'Marketing',
          'Data Science',
          'Produit',
          'DevOps',
          'Cybersecurite',
          'IA & ML',
          'IoT',
          'Blockchain',
        ],
      },
      {}
    );
  },
};

