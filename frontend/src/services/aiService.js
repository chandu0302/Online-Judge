import apiClient from "../api/axiosInstance.js";

/**
 * Request an AI review for the given code.
 */
export const requestAIReview = async ({ problemId, code, language }) => {
  const response = await apiClient.post("/api/ai/review", {
    problemId,
    code,
    language,
  });
  return response.data;
};

/**
 * Fetch all AI reviews for the current user.
 */
export const getAIReviewHistory = async () => {
  const response = await apiClient.get("/api/ai/reviews");
  return response.data;
};
