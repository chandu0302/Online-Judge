require('dotenv').config();

const connectDB = require('../config/db');
const Problem = require('../models/Problem');
const User = require('../models/User');
const slugify = require('../utils/slugify');

const dsaProblems = [
  {
    title: 'Longest Increasing Subsequence',
    statement: 'Given an integer array, return the length of the longest strictly increasing subsequence.',
    difficulty: 'Medium',
    tags: ['dynamic-programming', 'array'],
    examples: [
      { input: '[10,9,2,5,3,7,101,18]', output: '4', explanation: 'The LIS is [2,3,7,101]' },
    ],
  },
  {
    title: "Dijkstra's Shortest Path",
    statement: 'Given a weighted graph and source vertex, return shortest distances to all vertices from the source.',
    difficulty: 'Medium',
    tags: ['graphs', 'dijkstra'],
    examples: [
      { input: 'Graph with 5 vertices, source=0', output: '[0,2,5,6,7]', explanation: 'Shortest path distances' },
    ],
  },
  {
    title: 'Topological Sort',
    statement: 'Given a directed acyclic graph (DAG), return one valid topological ordering of its vertices.',
    difficulty: 'Medium',
    tags: ['graphs', 'topological-sort'],
    examples: [
      { input: 'DAG with edges [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]', output: '[5,4,2,3,1,0]', explanation: 'One valid ordering' },
    ],
  },
  {
    title: 'Binary Tree Inorder Traversal',
    statement: 'Given the root of a binary tree, return its inorder traversal.',
    difficulty: 'Easy',
    tags: ['trees', 'stack'],
    examples: [
      { input: '[1,null,2,3]', output: '[1,3,2]', explanation: 'Inorder traversal' },
    ],
  },
  {
    title: '0/1 Knapsack Problem',
    statement: 'Given weights and values of n items and a capacity W, find the maximum value that can be put in a knapsack of capacity W (0/1 knapsack).',
    difficulty: 'Hard',
    tags: ['dynamic-programming', 'knapsack'],
    examples: [
      { input: 'weights=[1,3,4], values=[1500,2000,3000], W=4', output: '3500', explanation: 'Pick items with weights 1 and 3' },
    ],
  },
];

const seed = async () => {
  await connectDB();

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('No admin user found. Please create an admin account first (via /api/auth/register).');
    process.exit(1);
  }

  const problems = dsaProblems.map((p) => ({
    ...p,
    slug: slugify(p.title),
    createdBy: admin._id,
    isPublished: true,
  }));

  for (const prob of problems) {
    const existing = await Problem.findOne({ slug: prob.slug });
    if (existing) {
      await Problem.updateOne({ _id: existing._id }, prob);
      console.log(`Updated existing problem '${prob.title}'`);
    } else {
      await Problem.create(prob);
      console.log(`Created problem '${prob.title}'`);
    }
  }

  console.log('DSA problems seeded.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
