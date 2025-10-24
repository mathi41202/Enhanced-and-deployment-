require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
const TEMP_DIR = path.resolve(process.env.TEMP_DIR || './uploads/temp');
const FINAL_DIR = path.resolve(process.env.FINAL_DIR || './uploads/final');

[UPLOAD_DIR, TEMP_DIR, FINAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// static serve final files (example)
app.use('/files', express.static(FINAL_DIR));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`File Upload Manager backend listening on port ${PORT}`);
});
