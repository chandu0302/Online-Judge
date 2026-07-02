const runCppContainer = require("../sandbox/runCppContainer");
const runPythonContainer = require("../sandbox/runPythonContainer");
const runJavaContainer = require("../sandbox/runJavaContainer");
const { ensureDockerReady } = require("../sandbox/createContainer");

/**
 * Route execution requests through Docker isolated containers.
 * No code execution should occur directly on the host machine.
 */
const executeCode = async ({ language, codeFilePath, inputFilePath = null }) => {
  if (language === "cpp") {
    return runCppContainer(codeFilePath, inputFilePath);
  }

  if (language === "python") {
    return runPythonContainer(codeFilePath, inputFilePath);
  }

  if (language === "java") {
    return runJavaContainer(codeFilePath, inputFilePath);
  }

  throw {
    errorType: "ValidationError",
    message: `Language "${language}" is not supported in the sandbox environment.`,
    statusCode: 400,
  };
};

const runCodeWithPreflight = async (params) => {
  try {
    await ensureDockerReady();
  } catch (preflightError) {
    throw {
      errorType: "InternalServerError",
      message: preflightError.message,
      statusCode: 500,
      containerName: "preflight-check",
    };
  }

  return executeCode(params);
};

module.exports = runCodeWithPreflight;
