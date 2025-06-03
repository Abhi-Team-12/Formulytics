const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Store latest uploaded file name
let latestFileMeta = {
  filename: '',
  columns: []
};

// === Route: Upload & Generate Insights ===
router.post("/generate", upload.single("file"), (req, res) => {
  const { xAxis, yAxis } = req.body;

  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Extract column names from first row
    const columns = Object.keys(sheet[0] || {});

    latestFileMeta = {
      filename: req.file.originalname,
      columns
    };

    fs.unlinkSync(filePath); // Clean up temp file

    if (!sheet.length || !sheet[0][xAxis] || !sheet[0][yAxis]) {
      return res.status(400).json({ error: "Invalid X or Y Axis" });
    }

    const xData = sheet.map((row) => row[xAxis]);
    const yData = sheet.map((row) => parseFloat(row[yAxis])).filter(val => !isNaN(val));

    // === Insight Logic ===
    const avg = yData.reduce((a, b) => a + b, 0) / yData.length;
    const stdDev = Math.sqrt(yData.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / yData.length);
    const correlation = getCorrelation(xData, yData);

    const trend = correlation > 0.2
      ? `${yAxis} increases with ${xAxis}`
      : correlation < -0.2
      ? `${yAxis} decreases with ${xAxis}`
      : `No strong correlation between ${xAxis} and ${yAxis}`;

    const anomaly =
      stdDev > avg * 0.2
        ? "High variability detected. Potential anomalies exist."
        : "No significant anomalies detected.";

    const action = `Focus on ${xAxis} values where ${yAxis} is in the top 10% for better performance.`;

    res.json({ trend, anomaly, actionable: action });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process file or data." });
  }
});

// === Route: Get Latest Uploaded File Info ===
router.get("/latest-file", (req, res) => {
  if (!latestFileMeta.filename) {
    return res.status(404).json({ error: "No file uploaded yet." });
  }
  res.json(latestFileMeta);
});

// === Route: Export ===
router.post("/export/:type", (req, res) => {
  const { type } = req.params;
  const { insights } = req.body;

  const content = `Trend: ${insights.trend}\nAnomaly: ${insights.anomaly}\nActionable: ${insights.actionable}`;
  const filename = `insights.${type}`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', type === 'pdf' ? 'application/pdf' : 'text/plain');

  if (type === 'pdf') {
    // You can later replace this with PDFKit or Puppeteer logic
    res.send(content); // Just plain text for now
  } else {
    res.send(content);
  }
});

// === Helper: Correlation ===
function getCorrelation(x, y) {
  const meanX = mean(x);
  const meanY = mean(y);

  const numerator = x.reduce((acc, val, i) => acc + (val - meanX) * (y[i] - meanY), 0);
  const denominator = Math.sqrt(
    x.reduce((acc, val) => acc + Math.pow(val - meanX, 2), 0) *
    y.reduce((acc, val) => acc + Math.pow(val - meanY, 2), 0)
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

function mean(arr) {
  const numeric = arr.map((val) => parseFloat(val)).filter((n) => !isNaN(n));
  return numeric.reduce((a, b) => a + b, 0) / numeric.length;
}

module.exports = router;
