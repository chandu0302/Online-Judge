const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

/**
 * Normalizes Windows backslash paths to POSIX forward-slash paths
 * for Docker volume mounts on Windows / Docker Desktop.
 */
const normalizeDockerPath = (filePath) => {
  if (!filePath) return filePath;
  return filePath.replace(/\\/g, "/");
};

/**
 * Checks if Docker is available and the oj-sandbox image exists.
 * Throws a descriptive error if either check fails.
 */
const ensureDockerReady = async () => {
  return new Promise((resolve, reject) => {
    const checkTimer = setTimeout(() => {
      reject(new Error("Docker pre-flight check timed out. Ensure Docker is running and accessible."));
    }, 5000);

    exec("docker version", (error) => {
      if (error) {
        clearTimeout(checkTimer);
        return reject(new Error("Docker is not running or not installed. Please start Docker Desktop and try again."));
      }

      exec('docker images -q oj-sandbox', (error, stdout) => {
        clearTimeout(checkTimer);
        if (error || !stdout.trim()) {
          return reject(new Error("Docker image 'oj-sandbox' not found. Build it with: docker build -t oj-sandbox ./backend"));
        }
        resolve();
      });
    });
  });
};

/**
 * Core utility to run commands in the docker sandbox.
 * 
 * @param {string} jobDir - Directory where code and run.sh are located.
 * @param {string} inputFilePath - Path to the input file.
 * @param {number} timeoutMs - Execution timeout limit.
 * @returns {Promise<object>} - Result containing stdout, stderr, exitCode, timedOut.
 */
const runInSandbox = (jobDir, inputFilePath, timeoutMs = 2000) => {
  return new Promise((resolve, reject) => {
    const containerName = `oj-sandbox-${uuidv4()}`;

    // Normalize paths for Docker Desktop on Windows
    const dockerJobDir = normalizeDockerPath(jobDir);
    const dockerInputPath = normalizeDockerPath(inputFilePath);
    
    const runShPath = path.join(jobDir, "run.sh");
    
    const dockerCmd = `docker run --name ${containerName} --rm --cpus=1 --memory=256m --memory-swap=256m --pids-limit=30 --network=none -v "${dockerJobDir}:/app/src" -v "${dockerInputPath}:/app/input.txt:ro" oj-sandbox bash /app/src/run.sh`;

    let isTimedOut = false;
    let timer;

    console.log(`[Sandbox] Creating container ${containerName} for job in ${dockerJobDir}`);

    const child = exec(dockerCmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (timer) clearTimeout(timer);

      if (isTimedOut) {
        return resolve({
          containerName,
          timedOut: true,
          stdout: "",
          stderr: "Time Limit Exceeded",
          exitCode: 124,
        });
      }

      if (error && !stdout && !stderr) {
        const message = error.message || "Failed to execute Docker container";
        console.error(`[Sandbox] Docker error for ${containerName}:`, message);
        return reject({
          errorType: "InternalServerError",
          message: `Sandbox execution failed: ${message}`,
          statusCode: 500,
          containerName,
        });
      }

      const exitCode = error ? error.code : 0;
      resolve({
        containerName,
        timedOut: false,
        stdout,
        stderr,
        exitCode,
      });
    });

    timer = setTimeout(() => {
      isTimedOut = true;
      child.kill("SIGTERM");
      
      console.log(`[Sandbox] Job timed out. Killing container ${containerName}`);
      exec(`docker kill ${containerName}`, (err) => {
        if (err) {
          console.error(`[Sandbox] Failed to kill container ${containerName}:`, err.message);
        }
      });
    }, timeoutMs);
  });
};

module.exports = { runInSandbox, ensureDockerReady };
