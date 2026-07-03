const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const extensionMap = {
  cpp: "cpp",
  java: "java",
  python: "py",
};

const codesDir = path.join(__dirname, "../../codes");

const ensureDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const extractJavaClassName = (code) => {
  const match = code.match(/public\s+(?:final\s+|abstract\s+)?class\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
  return match ? match[1] : "Main";
};

const generateFile = async ({ language, code }) => {
  const extension = extensionMap[language];

  if (!extension) {
    throw new Error("Unsupported language");
  }

  ensureDirectory(codesDir);

  const jobId = randomUUID();
  const jobDir = path.join(codesDir, jobId);
  ensureDirectory(jobDir);

  const fileName = language === "java" ? `${extractJavaClassName(code)}.java` : `${jobId}.${extension}`;
  const filePath = path.join(jobDir, fileName);

  fs.writeFileSync(filePath, code);

  return filePath;
};

module.exports = generateFile;
