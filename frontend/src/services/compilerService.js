import apiClient from "../api/axiosInstance.js";

export const runCode = async ({ language, code, input = "" }) => {
  const response = await apiClient.post("/api/compiler/run", {
    language,
    code,
    input,
  });
  return response.data;
};
