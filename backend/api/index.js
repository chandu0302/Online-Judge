require("dotenv").config();

const mongoose = require("mongoose");
const app = require("../src/app");

const ensureDbConnected = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(process.env.MONGODB_URI, { dbName: "test" });
  console.log(`[DB] Connected to database: "${mongoose.connection.name}"`);
};

module.exports = async (req, res) => {
  try {
    await ensureDbConnected();
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, message: "Database connection failed" }));
    return;
  }

  return app(req, res);
};
