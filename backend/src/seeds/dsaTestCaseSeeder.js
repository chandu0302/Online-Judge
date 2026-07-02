require('dotenv').config();

const connectDB = require('../config/db');
const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');

const testCasesBySlug = {
  'longest-increasing-subsequence': [
    { input: '10 9 2 5 3 7 101 18', expectedOutput: '4', isHidden: false },
    { input: '0', expectedOutput: '0', isHidden: false },
    { input: '1 2 3 4 5', expectedOutput: '5', isHidden: true },
  ],
  'dijkstras-shortest-path': [
    { input: '5 6\n0 1 2\n0 2 5\n1 2 1\n1 3 2\n2 3 3\n3 4 1\n0', expectedOutput: '0 2 3 4 5', isHidden: false },
    { input: '3 3\n0 1 4\n1 2 6\n0 2 5\n0', expectedOutput: '0 4 5', isHidden: true },
  ],
  'topological-sort': [
    { input: '6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1', expectedOutput: '5 4 2 3 1 0', isHidden: false },
    { input: '3 2\n0 1\n1 2', expectedOutput: '0 1 2', isHidden: true },
  ],
  'binary-tree-inorder-traversal': [
    { input: '1 null 2 3', expectedOutput: '1 3 2', isHidden: false },
    { input: '2 1 3', expectedOutput: '1 2 3', isHidden: true },
  ],
  '01-knapsack-problem': [
    { input: '3\n1 3 4\n1500 2000 3000\n4', expectedOutput: '3500', isHidden: false },
    { input: '4\n2 3 4 5\n3 4 5 6\n5', expectedOutput: '9', isHidden: true },
  ],
};

const seed = async () => {
  await connectDB();

  for (const slug of Object.keys(testCasesBySlug)) {
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      console.warn(`Problem with slug '${slug}' not found — skipping.`);
      continue;
    }

    const cases = testCasesBySlug[slug].map((tc) => ({
      problemId: problem._id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden || false,
    }));

    // Remove existing testcases for the problem and insert new ones
    await TestCase.deleteMany({ problemId: problem._id });
    await TestCase.insertMany(cases);

    console.log(`Seeded ${cases.length} test cases for '${problem.title}'`);
  }

  console.log('DSA test cases seeded.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
