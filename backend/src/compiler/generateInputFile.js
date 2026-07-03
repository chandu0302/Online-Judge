const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const inputsDir = path.join(__dirname, "../../inputs");

const ensureDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const generateInputFile = async (input = "") => {
  ensureDirectory(inputsDir);

  const filePath = path.join(inputsDir, `${randomUUID()}.txt`);

  fs.writeFileSync(filePath, input ?? "");

  return filePath;
};

module.exports = generateInputFile;
