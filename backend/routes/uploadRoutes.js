const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { ExcelFile } = require('../models/uploadedfile');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Folder where uploaded files will be stored
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Configure multer for file upload with diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// =================== ROUTES =================== //

// Protected upload route
router.post('/', verifyToken, upload.single('excel'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    const newFile = new ExcelFile({
      fileName: req.file.filename,
      data: jsonData,
      user: req.user.id, // from verifyToken middleware
    });

    await newFile.save();
    res.status(201).json({ message: 'File uploaded and saved', file: newFile });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error saving file' });
  }
});

// Get list of uploaded files for the logged-in user
router.get('/files', verifyToken, async (req, res) => {
  try {
    const files = await ExcelFile.find({ user: req.user.id }).select('fileName data createdAt updatedAt');
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching uploaded files' });
  }
});

// Get full data from a specific file (only if owned by user)
router.get('/data/:fileId', verifyToken, async (req, res) => {
  try {
    const file = await ExcelFile.findOne({ _id: req.params.fileId, user: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found or access denied' });

    res.json({ data: file.data });
  } catch (error) {
    console.error('Error fetching file data:', error);
    res.status(500).json({ message: 'Error fetching file data' });
  }
});

// =================== DELETE route =================== //
router.delete('/files/:id', verifyToken, async (req, res) => {
  try {
    const file = await ExcelFile.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!file) {
      return res.status(404).json({ message: 'File not found or access denied' });
    }

    // Delete the actual uploaded file from disk
    const filePath = path.join(UPLOAD_DIR, file.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router;