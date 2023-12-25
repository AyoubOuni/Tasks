const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const { title, priority, status } = req.body;

  try {
    const task = await Task.create({ title, priority, status });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task by ID
router.put('/:id', async (req, res) => {
  const taskId = req.params.id;
  const { title, priority, status } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ title, priority, status });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
