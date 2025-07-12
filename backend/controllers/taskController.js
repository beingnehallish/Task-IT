const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { taskName, teammates, deadline, taskDetails, teamLead, createdBy } = req.body;
  try {
    const task = new Task({ taskName, teammates, deadline, taskDetails, teamLead, createdBy });
    await task.save();
    res.json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeTasks = async (req, res) => {
  const { email } = req.params;
  try {
    const tasks = await Task.find({ teammates: email });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSupervisorTasks = async (req, res) => {
  const { email } = req.params;
  try {
    const tasks = await Task.find({ createdBy: email });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
