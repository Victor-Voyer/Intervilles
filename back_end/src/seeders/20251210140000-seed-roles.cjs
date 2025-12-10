'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'USER',
        },
        {
          name: 'MODERATOR',
        },
        {
          name: 'ADMIN',
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'roles',
      {
        name: ['USER', 'MODERATOR', 'ADMIN'],
      },
      {}
    );
  },
};

