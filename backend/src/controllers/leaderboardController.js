const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const leaderboardService = require("../services/leaderboardService");

const getLeaderboard = asyncHandler(async (req, res) => {
  const result = await leaderboardService.getLeaderboard(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, "Leaderboard fetched successfully", result));
});

module.exports = {
  getLeaderboard,
};
