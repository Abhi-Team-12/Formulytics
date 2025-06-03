const mongoose = require('mongoose');

// Define user schema with appropriate validations
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // Make email lowercase and trim extra spaces
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Default role set to 'user'
}, {
  timestamps: true // Add timestamps (createdAt, updatedAt)
});

// Create and export User model
module.exports = mongoose.model('User', userSchema);
