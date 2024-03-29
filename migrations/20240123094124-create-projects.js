'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_name: {
        type: Sequelize.STRING
      },
      startdate: {
        type: Sequelize.DATEONLY
      },
      enddate: {
        type: Sequelize.DATEONLY
      },
      duration: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      nodejs: {
        type: Sequelize.STRING
      },
      golang: {
        type: Sequelize.STRING
      },
      vuejs: {
        type: Sequelize.STRING
      },
      reactjs: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};