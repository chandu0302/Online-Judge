const express = require("express");
const { getLeaderboard, getMyStanding } = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getLeaderboard);
router.get("/me", protect, getMyStanding);

module.exports = router;
