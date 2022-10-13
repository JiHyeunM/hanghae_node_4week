// 익스프레스 내에서 해당하는 데이터베이스에 있는 테이블을 사용하기 위해 쓴다
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
  }, {
    timestamps: false,
    sequelize,
    modelName: 'User',
  });
  return User;
};