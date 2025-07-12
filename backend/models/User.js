const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // plaintext for now
  role: String // 'employee' or 'supervisor'
});

module.exports = mongoose.model('User', userSchema);
