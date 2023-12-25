const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('High', 'Medium', 'Low'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('To Do', 'Done', 'In Progress'),
    allowNull: false,
    defaultValue: 'To Do',
  },
});

// Ensure proper synchronization of the Task model with the database
(async () => {
  try {
    await Task.sync({ alter: true });
    console.log('Task model synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing Task model:', error);
  }
})();

module.exports = Task;
