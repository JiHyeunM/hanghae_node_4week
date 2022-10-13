// 실제 데이터베이스에 있는 테이블을 만들기 위해 사용
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false, // null을 허용할지
        autoIncrement: true, // 키의 값을 지정하지 않았을 때 자동적으로 기존 값에서 1씩 추가하라
        primaryKey: true, // userId 가 기본 키라는 것
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};