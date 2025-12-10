'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'promos',
      [
        {
          name: 'Bordeaux',
          year: 2025,
        },
        {
          name: 'Paris',
          year: 2025,
        },
        {
          name: 'Lyon',
          year: 2025,
        },
        {
          name: 'Marseille',
          year: 2025,
        },
        {
          name: 'Toulouse',
          year: 2025,
        },
        {
          name: 'Cannes',
          year: 2025,
        },
        {
          name: 'Martigues',
          year: 2025,
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'promos',
      {
        name: ['Bordeaux', 'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Cannes', 'Martigues'],
        year: [2025],
      },
      {}
    );
  },
};
