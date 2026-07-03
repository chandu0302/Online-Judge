const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const leaderboardService = require("../services/leaderboardService");

const getLeaderboard = asyncHandler(async (req, res) => {
  const result = await leaderboardService.getLeaderboard(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, "Leaderboard fetched successfully", result));
});

const getMyStanding = asyncHandler(async (req, res) => {
  const result = await leaderboardService.getUserStanding(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Standing fetched successfully", result));
});

module.exports = {
  getLeaderboard,
  getMyStanding,
};
