require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Problem = require("../models/Problem");
const User = require("../models/User");
const TestCase = require("../models/TestCase");
const slugify = require("../utils/slugify");

/**
 * A batch of additional beginner/intermediate coding problems.
 * Each problem is fully judge-ready: it has a stdin/stdout compatible
 * input/output format description plus example(s), and a matching set
 * of test cases (public + hidden) defined below in `testCasesBySlug`.
 */
const newProblems = [
  {
    title: "FizzBuzz",
    statement:
      "Given an integer n, print the numbers from 1 to n, each on its own line. " +
      "But for multiples of 3, print 'Fizz' instead of the number, for multiples of 5, " +
      "print 'Buzz' instead of the number, and for multiples of both 3 and 5, print 'FizzBuzz'.",
    inputFormat: "A single line containing one integer n.",
    outputFormat: "n lines, each containing the number, 'Fizz', 'Buzz', or 'FizzBuzz'.",
    constraints: "1 <= n <= 10^5",
    difficulty: "Easy",
    tags: ["basic", "math"],
    examples: [
      {
        input: "5",
        output: "1\n2\nFizz\n4\nBuzz",
        explanation: "3 is a multiple of 3 so it becomes 'Fizz'; 5 is a multiple of 5 so it becomes 'Buzz'.",
      },
    ],
  },
  {
    title: "Factorial of a Number",
    statement: "Given a non-negative integer n, compute and print n! (n factorial).",
    inputFormat: "A single line containing one integer n.",
    outputFormat: "A single integer representing n!.",
    constraints: "0 <= n <= 20",
    difficulty: "Easy",
    tags: ["math", "basic"],
    examples: [
      {
        input: "5",
        output: "120",
        explanation: "5! = 5 * 4 * 3 * 2 * 1 = 120",
      },
    ],
  },
  {
    title: "Check Prime Number",
    statement:
      "Given an integer n, determine whether it is a prime number. Print 'Yes' if n is prime, otherwise print 'No'.",
    inputFormat: "A single line containing one integer n.",
    outputFormat: "'Yes' if n is prime, otherwise 'No'.",
    constraints: "1 <= n <= 10^6",
    difficulty: "Easy",
    tags: ["math", "basic"],
    examples: [
      {
        input: "7",
        output: "Yes",
        explanation: "7 has no divisors other than 1 and itself.",
      },
    ],
  },
  {
    title: "Sum of Digits",
    statement: "Given a non-negative integer n, compute the sum of its digits.",
    inputFormat: "A single line containing one integer n.",
    outputFormat: "A single integer representing the sum of the digits of n.",
    constraints: "0 <= n <= 10^18",
    difficulty: "Easy",
    tags: ["math", "basic"],
    examples: [
      {
        input: "12345",
        output: "15",
        explanation: "1 + 2 + 3 + 4 + 5 = 15",
      },
    ],
  },
  {
    title: "GCD of Two Numbers",
    statement: "Given two non-negative integers a and b, compute their greatest common divisor (GCD).",
    inputFormat: "Two space-separated integers a and b on a single line.",
    outputFormat: "A single integer representing gcd(a, b).",
    constraints: "0 <= a, b <= 10^9",
    difficulty: "Easy",
    tags: ["math", "basic"],
    examples: [
      {
        input: "12 18",
        output: "6",
        explanation: "The largest number that divides both 12 and 18 is 6.",
      },
    ],
  },
  {
    title: "Reverse a Number",
    statement:
      "Given an integer n, print the number obtained by reversing its digits. Leading zeros in the " +
      "reversed number should be dropped (e.g. reversing 120 gives 21).",
    inputFormat: "A single line containing one non-negative integer n.",
    outputFormat: "A single integer representing n with its digits reversed.",
    constraints: "0 <= n <= 10^9",
    difficulty: "Easy",
    tags: ["math", "basic"],
    examples: [
      {
        input: "12345",
        output: "54321",
        explanation: "Reversing the digits of 12345 gives 54321.",
      },
    ],
  },
  {
    title: "Maximum Subarray Sum",
    statement:
      "Given an array of n integers, find the contiguous subarray (containing at least one number) " +
      "which has the largest sum, and print that sum.",
    inputFormat:
      "First line contains an integer n. Second line contains n space-separated integers.",
    outputFormat: "A single integer representing the maximum subarray sum.",
    constraints: "1 <= n <= 10^5, -10^4 <= arr[i] <= 10^4",
    difficulty: "Medium",
    tags: ["array", "dynamic-programming"],
    examples: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum = 6.",
      },
    ],
  },
  {
    title: "Count Vowels in a String",
    statement:
      "Given a single word (a string without spaces), count how many vowels (a, e, i, o, u — case-insensitive) it contains.",
    inputFormat: "A single line containing a string s with no spaces.",
    outputFormat: "A single integer representing the number of vowels in s.",
    constraints: "1 <= |s| <= 10^5, s contains only English letters.",
    difficulty: "Easy",
    tags: ["string", "basic"],
    examples: [
      {
        input: "HelloWorld",
        output: "3",
        explanation: "The vowels in 'HelloWorld' are e, o, o.",
      },
    ],
  },
  {
    title: "Armstrong Number Check",
    statement:
      "An Armstrong number (also known as narcissistic number) is a number that is equal to the sum " +
      "of its own digits, each raised to the power of the number of digits. Given an integer n, print " +
      "'Yes' if it is an Armstrong number, otherwise print 'No'.",
    inputFormat: "A single line containing one integer n.",
    outputFormat: "'Yes' if n is an Armstrong number, otherwise 'No'.",
    constraints: "1 <= n <= 10^9",
    difficulty: "Medium",
    tags: ["math"],
    examples: [
      {
        input: "153",
        output: "Yes",
        explanation: "1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.",
      },
    ],
  },
  {
    title: "Merge Two Sorted Arrays",
    statement:
      "Given two sorted arrays of sizes n and m, merge them into a single sorted array and print the result " +
      "as space-separated integers.",
    inputFormat:
      "First line contains two integers n and m. Second line contains n space-separated integers " +
      "(the first array). Third line contains m space-separated integers (the second array).",
    outputFormat: "A single line containing the merged sorted array as space-separated integers.",
    constraints: "0 <= n, m <= 10^5, -10^9 <= arr[i] <= 10^9",
    difficulty: "Easy",
    tags: ["array", "two-pointers"],
    examples: [
      {
        input: "3 3\n1 3 5\n2 4 6",
        output: "1 2 3 4 5 6",
        explanation: "Merging [1,3,5] and [2,4,6] gives [1,2,3,4,5,6].",
      },
    ],
  },
];

const testCasesBySlug = {
  fizzbuzz: [
    { input: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz", isHidden: false },
    {
      input: "15",
      expectedOutput:
        "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      isHidden: false,
    },
    { input: "1", expectedOutput: "1", isHidden: true },
    { input: "3", expectedOutput: "1\n2\nFizz", isHidden: true },
    {
      input: "30",
      expectedOutput:
        "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz",
      isHidden: true,
    },
  ],
  "factorial-of-a-number": [
    { input: "5", expectedOutput: "120", isHidden: false },
    { input: "0", expectedOutput: "1", isHidden: false },
    { input: "1", expectedOutput: "1", isHidden: true },
    { input: "10", expectedOutput: "3628800", isHidden: true },
    { input: "12", expectedOutput: "479001600", isHidden: true },
  ],
  "check-prime-number": [
    { input: "7", expectedOutput: "Yes", isHidden: false },
    { input: "10", expectedOutput: "No", isHidden: false },
    { input: "1", expectedOutput: "No", isHidden: true },
    { input: "2", expectedOutput: "Yes", isHidden: true },
    { input: "97", expectedOutput: "Yes", isHidden: true },
  ],
  "sum-of-digits": [
    { input: "12345", expectedOutput: "15", isHidden: false },
    { input: "9", expectedOutput: "9", isHidden: false },
    { input: "0", expectedOutput: "0", isHidden: true },
    { input: "999999", expectedOutput: "54", isHidden: true },
    { input: "100000", expectedOutput: "1", isHidden: true },
  ],
  "gcd-of-two-numbers": [
    { input: "12 18", expectedOutput: "6", isHidden: false },
    { input: "7 13", expectedOutput: "1", isHidden: false },
    { input: "100 75", expectedOutput: "25", isHidden: true },
    { input: "0 5", expectedOutput: "5", isHidden: true },
    { input: "17 17", expectedOutput: "17", isHidden: true },
  ],
  "reverse-a-number": [
    { input: "12345", expectedOutput: "54321", isHidden: false },
    { input: "120", expectedOutput: "21", isHidden: false },
    { input: "7", expectedOutput: "7", isHidden: true },
    { input: "1000", expectedOutput: "1", isHidden: true },
    { input: "1000000", expectedOutput: "1", isHidden: true },
  ],
  "maximum-subarray-sum": [
    { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false },
    { input: "1\n1", expectedOutput: "1", isHidden: false },
    { input: "5\n-1 -2 -3 -4 -5", expectedOutput: "-1", isHidden: true },
    { input: "5\n1 2 3 4 5", expectedOutput: "15", isHidden: true },
    { input: "3\n0 0 0", expectedOutput: "0", isHidden: true },
  ],
  "count-vowels-in-a-string": [
    { input: "HelloWorld", expectedOutput: "3", isHidden: false },
    { input: "programming", expectedOutput: "3", isHidden: false },
    { input: "xyz", expectedOutput: "0", isHidden: true },
    { input: "AEIOUaeiou", expectedOutput: "10", isHidden: true },
    { input: "Codeforces", expectedOutput: "4", isHidden: true },
  ],
  "armstrong-number-check": [
    { input: "153", expectedOutput: "Yes", isHidden: false },
    { input: "123", expectedOutput: "No", isHidden: false },
    { input: "9474", expectedOutput: "Yes", isHidden: true },
    { input: "9", expectedOutput: "Yes", isHidden: true },
    { input: "10", expectedOutput: "No", isHidden: true },
  ],
  "merge-two-sorted-arrays": [
    { input: "3 3\n1 3 5\n2 4 6", expectedOutput: "1 2 3 4 5 6", isHidden: false },
    { input: "1 1\n5\n3", expectedOutput: "3 5", isHidden: false },
    { input: "4 2\n1 2 3 4\n0 5", expectedOutput: "0 1 2 3 4 5", isHidden: true },
    { input: "2 2\n-3 -1\n-2 0", expectedOutput: "-3 -2 -1 0", isHidden: true },
    { input: "3 1\n1 1 1\n1", expectedOutput: "1 1 1 1", isHidden: true },
  ],
};

const seed = async () => {
  await connectDB();

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.error(
      "Error: Please create at least one admin user in the system first (via /api/auth/register) before running this seeder."
    );
    process.exitCode = 1;
    return;
  }

  const problems = newProblems.map((problem) => ({
    ...problem,
    slug: slugify(problem.title),
    createdBy: admin._id,
    isPublished: true,
  }));

  for (const problemData of problems) {
    let problem = await Problem.findOne({ slug: problemData.slug });

    if (problem) {
      await Problem.updateOne({ _id: problem._id }, problemData);
      console.log(`Updated existing problem '${problemData.title}'`);
      problem = await Problem.findById(problem._id);
    } else {
      problem = await Problem.create(problemData);
      console.log(`Created problem '${problemData.title}'`);
    }

    const cases = testCasesBySlug[problem.slug];
    if (!cases || cases.length === 0) {
      console.warn(`No test cases defined for '${problem.title}' — skipping test case seeding.`);
      continue;
    }

    await TestCase.deleteMany({ problemId: problem._id });

    const testCaseDocs = cases.map((tc) => ({
      problemId: problem._id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: !!tc.isHidden,
    }));

    await TestCase.insertMany(testCaseDocs);
    console.log(
      `Seeded ${testCaseDocs.length} test case(s) (${
        testCaseDocs.filter((t) => !t.isHidden).length
      } public, ${testCaseDocs.filter((t) => t.isHidden).length} hidden) for '${problem.title}'`
    );
  }

  console.log(`\nDone. Seeded ${problems.length} new problems with test cases.`);
};

seed()
  .catch((error) => {
    console.error("New problem seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
