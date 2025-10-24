const fs = require('fs');
const path = require('path');
const { log } = require('./logger');

const TEMP_DIR = path.resolve(process.env.TEMP_DIR || './uploads/temp');
const FINAL_DIR = path.resolve(process.env.FINAL_DIR || './uploads/final');

function getTempFilePath(uploadId, index) {
  return path.join(TEMP_DIR, `${uploadId}.part.${index}`);
}

function appendChunkToTemp(uploadId, index, buffer) {
  const filePath = getTempFilePath(uploadId, index);
  fs.writeFileSync(filePath, buffer);
  log(`Chunk written: ${filePath}`);
  return filePath;
}

function assembleChunks(uploadId, totalChunks, filename) {
  const finalPath = path.join(FINAL_DIR, filename);
  const writeStream = fs.createWriteStream(finalPath);
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = getTempFilePath(uploadId, i);
    if (!fs.existsSync(chunkPath)) {
      writeStream.close();
      throw new Error(`Missing chunk ${i}`);
    }
    const data = fs.readFileSync(chunkPath);
    writeStream.write(data);
    fs.unlinkSync(chunkPath);
  }
  writeStream.end();
  log(`Assembled file: ${finalPath}`);
  return finalPath;
}

module.exports = { appendChunkToTemp, assembleChunks, getTempFilePath };
