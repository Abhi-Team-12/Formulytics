// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // single user model with role field

const router = express.Router();

// ==========================
// Admin Registration (optional)
// ==========================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashed,
      role: 'admin',
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { name: newAdmin.name, email: newAdmin.email, role: newAdmin.role },
    });
  } catch (err) {
    console.error('Error registering admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// Admin Login
// ==========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      token,
      admin: { name: admin.name, email: admin.email, role: 'admin' },
    });
  } catch (err) {
    console.error('Error logging in admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// Middleware to verify admin
// ==========================
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ==========================
// Admin-protected routes
// ==========================

// GET all users (non-admins)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// DELETE a user by ID
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// UPDATE user role
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// GET total users count (non-admins)
router.get('/users/count', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users count' });
  }
});

const { ExcelFile } = require('../models/uploadedfile'); // import your file model if needed

// GET total files count
router.get('/files/count', verifyAdmin, async (req, res) => {
  try {
    const totalFiles = await ExcelFile.countDocuments();
    res.json({ totalFiles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get files count' });
  }
});

module.exports = router;
