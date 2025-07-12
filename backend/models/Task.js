const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: String,
  teammates: [String], // employee emails or IDs
  deadline: Date,
  taskDetails: String,
  teamLead: String,
  status: { type: String, default: 'pending' }, // pending/ongoing/completed
  createdBy: String // supervisor ID or email
});

module.exports = mongoose.model('Task', taskSchema);
