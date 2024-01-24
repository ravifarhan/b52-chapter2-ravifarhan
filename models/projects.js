'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Projects.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }
  }
  Projects.init({
    project_name: DataTypes.STRING,
    startdate: DataTypes.DATEONLY,
    enddate: DataTypes.DATEONLY,
    duration: DataTypes.STRING, 
    description: DataTypes.TEXT,
    nodejs: DataTypes.STRING,
    golang: DataTypes.STRING,
    vuejs: DataTypes.STRING,
    reactjs: DataTypes.STRING,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Projects',
  });
  return Projects;
};