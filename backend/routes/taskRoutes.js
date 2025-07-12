const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); 
const {
  createTask,
  getEmployeeTasks,
  updateTaskStatus,
  getSupervisorTasks
} = require('../controllers/taskController');

//router.post('/create', createTask);
router.get('/employee/:email', getEmployeeTasks);
router.get('/supervisor/:email', getSupervisorTasks);
router.put('/update-status/:id', updateTaskStatus);
router.post('/create', async (req, res) => {
  try {
    const { taskName, taskDetails, deadline, teamLead, teammates } = req.body;

    console.log('Received create task request with data:', req.body);

    const newTask = new Task({
      taskName,
      taskDetails,
      deadline,
      teamLead,
      teammates,
      status: 'pending' // default status
    });

    await newTask.save();
    console.log('Task created successfully:', newTask);
    res.json(newTask);

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
