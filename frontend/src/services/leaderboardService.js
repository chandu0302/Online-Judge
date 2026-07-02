import apiClient from "../api/axiosInstance.js";

export const getLeaderboard = async ({ page = 1, limit = 50 } = {}) => {
  const response = await apiClient.get("/api/leaderboard", {
    params: { page, limit },
  });

  return response.data;
};
