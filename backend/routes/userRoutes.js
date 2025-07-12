const express = require('express');
const router = express.Router();
const { getAllUsers, register } = require('../controllers/userController');

router.get('/all', getAllUsers);
router.post('/register', register);
const User = require('../models/User');

// Get all employees (role == employee)
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

