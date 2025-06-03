// File 1: routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ==========================
// Register
// ==========================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required (name, email, password)' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const role = email === 'admin@gmail.com' ? 'admin' : 'user';

    const newUser = await User.create({ name, email, password: hashed, role });

    res.status(201).json({
      message: 'Registered successfully',
      user: { name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

// ==========================
// Login
// ==========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      if (password !== process.env.ADMIN_SECRET_PASSWORD) {
        return res.status(401).json({ message: 'Invalid credentials for admin' });
      }
    } else {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
});

// ==========================
// Test Route
// ==========================
router.get('/ping', (req, res) => {
  res.send('authRoutes is working ✅');
});

module.exports = router;
