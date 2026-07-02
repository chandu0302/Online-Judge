import apiClient from "../api/axiosInstance.js";

export const submitSolution = async ({ problemId, language, code }) => {
  const response = await apiClient.post("/api/submissions/submit", {
    problemId,
    language,
    code,
  });
  return response.data;
};

export const getMySubmissions = async () => {
  const response = await apiClient.get("/api/submissions/my");
  return response.data;
};

export const getSubmissionById = async (id) => {
  const response = await apiClient.get(`/api/submissions/${id}`);
  return response.data;
};
