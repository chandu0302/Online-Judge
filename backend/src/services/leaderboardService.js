const Submission = require("../models/Submission");

const DIFFICULTY_POINTS = { Easy: 1, Medium: 3, Hard: 5 };

const getLeaderboard = async ({ page = 1, limit = 50 } = {}) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const pipeline = [
    { $match: { verdict: "Accepted" } },
    {
      $group: {
        _id: { userId: "$userId", problemId: "$problemId" },
        firstAcceptedAt: { $min: "$createdAt" },
      },
    },
    {
      $lookup: {
        from: "problems",
        localField: "_id.problemId",
        foreignField: "_id",
        as: "problem",
      },
    },
    { $unwind: "$problem" },
    {
      $addFields: {
        points: {
          $switch: {
            branches: [
              { case: { $eq: ["$problem.difficulty", "Easy"] }, then: DIFFICULTY_POINTS.Easy },
              { case: { $eq: ["$problem.difficulty", "Medium"] }, then: DIFFICULTY_POINTS.Medium },
              { case: { $eq: ["$problem.difficulty", "Hard"] }, then: DIFFICULTY_POINTS.Hard },
            ],
            default: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id.userId",
        problemsSolved: { $sum: 1 },
        score: { $sum: "$points" },
        lastSolvedAt: { $max: "$firstAcceptedAt" },
        easySolved: {
          $sum: { $cond: [{ $eq: ["$problem.difficulty", "Easy"] }, 1, 0] },
        },
        mediumSolved: {
          $sum: { $cond: [{ $eq: ["$problem.difficulty", "Medium"] }, 1, 0] },
        },
        hardSolved: {
          $sum: { $cond: [{ $eq: ["$problem.difficulty", "Hard"] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $sort: { score: -1, lastSolvedAt: 1 } },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        problemsSolved: 1,
        score: 1,
        lastSolvedAt: 1,
        breakdown: {
          easy: "$easySolved",
          medium: "$mediumSolved",
          hard: "$hardSolved",
        },
      },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: safeLimit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const [result] = await Submission.aggregate(pipeline);
  const rows = result?.data || [];
  const total = result?.totalCount?.[0]?.count || 0;

  const leaderboard = rows.map((row, index) => ({
    rank: skip + index + 1,
    ...row,
  }));

  return {
    leaderboard,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
};

module.exports = { getLeaderboard };
