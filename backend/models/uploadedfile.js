const mongoose = require('mongoose');

const excelFileSchema = new mongoose.Schema({
  fileName: String,
  data: [mongoose.Schema.Types.Mixed],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to the User model
    required: true
  }
}, { timestamps: true });

const ExcelFile = mongoose.model('ExcelFile', excelFileSchema);
module.exports = { ExcelFile };