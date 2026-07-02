import apiClient from "../api/axiosInstance.js";

export const getProblems = async () => {
  const response = await apiClient.get("/api/problems", {
    params: {
      limit: 50,
    },
  });

  return response.data;
};

export const getProblemById = async (problemId) => {
  const response = await apiClient.get(`/api/problems/${problemId}`);
  return response.data;
};
