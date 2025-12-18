'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('chat_messages', 'scope', {
      type: Sequelize.ENUM('global', 'promo'),
      allowNull: false,
      defaultValue: 'global',
    });

    await queryInterface.addColumn('chat_messages', 'promo_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'promos',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });

  
    await queryInterface.addIndex('chat_messages', ['scope']);
    await queryInterface.addIndex('chat_messages', ['promo_id']);
    await queryInterface.addIndex('chat_messages', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('chat_messages', ['scope']);
    await queryInterface.removeIndex('chat_messages', ['promo_id']);
    await queryInterface.removeIndex('chat_messages', ['user_id']);

    await queryInterface.removeColumn('chat_messages', 'promo_id');
    await queryInterface.removeColumn('chat_messages', 'scope');

  },
};
