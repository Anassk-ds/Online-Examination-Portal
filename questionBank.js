export const CODING_QUESTION_BANK = [
  {
    id: 'sum-two-numbers',
    title: 'Sum of Two Numbers',
    difficulty: 'Easy',
    tags: ['math', 'basics'],
    statement: 'Read two space-separated integers A and B from standard input and print their sum.',
    sampleInput: '3 5',
    sampleOutput: '8',
    testCases: [
      { input: '3 5', output: '8' },
      { input: '10 -2', output: '8' },
      { input: '0 0', output: '0' },
      { input: '100 200', output: '300' }
    ]
  },
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'Easy',
    tags: ['strings'],
    statement: 'Read a single line of text and print it reversed.',
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    testCases: [
      { input: 'hello', output: 'olleh' },
      { input: 'racecar', output: 'racecar' },
      { input: 'OpenAI', output: 'IAnepO' },
      { input: 'a', output: 'a' }
    ]
  },
  {
    id: 'palindrome-check',
    title: 'Check Palindrome',
    difficulty: 'Easy',
    tags: ['strings'],
    statement: 'Read a single word and print "YES" if it is a palindrome, otherwise print "NO".',
    sampleInput: 'madam',
    sampleOutput: 'YES',
    testCases: [
      { input: 'madam', output: 'YES' },
      { input: 'hello', output: 'NO' },
      { input: 'level', output: 'YES' },
      { input: 'world', output: 'NO' }
    ]
  },
  {
    id: 'factorial',
    title: 'Factorial of a Number',
    difficulty: 'Easy',
    tags: ['math', 'recursion'],
    statement: 'Read an integer N and print N! (the factorial of N).',
    sampleInput: '5',
    sampleOutput: '120',
    testCases: [
      { input: '5', output: '120' },
      { input: '0', output: '1' },
      { input: '1', output: '1' },
      { input: '7', output: '5040' }
    ]
  },
  {
    id: 'fibonacci-nth',
    title: 'Nth Fibonacci Number',
    difficulty: 'Medium',
    tags: ['math', 'dp'],
    statement: 'Read an integer N and print the Nth Fibonacci number, where Fibonacci(0) = 0 and Fibonacci(1) = 1.',
    sampleInput: '6',
    sampleOutput: '8',
    testCases: [
      { input: '6', output: '8' },
      { input: '0', output: '0' },
      { input: '1', output: '1' },
      { input: '10', output: '55' }
    ]
  },
  {
    id: 'max-in-array',
    title: 'Find the Maximum in an Array',
    difficulty: 'Easy',
    tags: ['arrays'],
    statement: 'Read an integer N, then N space-separated integers on the next line. Print the maximum value.',
    sampleInput: '5\n3 9 1 7 4',
    sampleOutput: '9',
    testCases: [
      { input: '5\n3 9 1 7 4', output: '9' },
      { input: '3\n-1 -5 -2', output: '-1' },
      { input: '1\n42', output: '42' },
      { input: '4\n10 10 10 10', output: '10' }
    ]
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels in a String',
    difficulty: 'Easy',
    tags: ['strings'],
    statement: 'Read a line of text and print the number of vowels (a, e, i, o, u — case-insensitive) it contains.',
    sampleInput: 'Hello World',
    sampleOutput: '3',
    testCases: [
      { input: 'Hello World', output: '3' },
      { input: 'xyz', output: '0' },
      { input: 'AEIOUaeiou', output: '10' },
      { input: 'Programming', output: '3' }
    ]
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    difficulty: 'Easy',
    tags: ['loops', 'basics'],
    statement: 'Read an integer N. For each integer i from 1 to N, print "Fizz" if i is divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, otherwise print i. Print one value per line.',
    sampleInput: '5',
    sampleOutput: '1\n2\nFizz\n4\nBuzz',
    testCases: [
      { input: '5', output: '1\n2\nFizz\n4\nBuzz' },
      { input: '3', output: '1\n2\nFizz' },
      { input: '15', output: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }
    ]
  },
  {
    id: 'prime-check',
    title: 'Check Prime Number',
    difficulty: 'Medium',
    tags: ['math'],
    statement: 'Read an integer N and print "YES" if it is a prime number, otherwise print "NO".',
    sampleInput: '7',
    sampleOutput: 'YES',
    testCases: [
      { input: '7', output: 'YES' },
      { input: '10', output: 'NO' },
      { input: '2', output: 'YES' },
      { input: '1', output: 'NO' }
    ]
  },
  {
    id: 'sort-array',
    title: 'Sort an Array (Ascending)',
    difficulty: 'Easy',
    tags: ['arrays', 'sorting'],
    statement: 'Read an integer N, then N space-separated integers. Print them sorted in ascending order, space-separated.',
    sampleInput: '4\n9 3 7 1',
    sampleOutput: '1 3 7 9',
    testCases: [
      { input: '4\n9 3 7 1', output: '1 3 7 9' },
      { input: '3\n-1 5 0', output: '-1 0 5' },
      { input: '1\n8', output: '8' },
      { input: '5\n5 4 3 2 1', output: '1 2 3 4 5' }
    ]
  },
  {
    id: 'anagram-check',
    title: 'Check Anagram',
    difficulty: 'Medium',
    tags: ['strings'],
    statement: 'Read two words on two separate lines. Print "YES" if they are anagrams of each other, otherwise print "NO".',
    sampleInput: 'listen\nsilent',
    sampleOutput: 'YES',
    testCases: [
      { input: 'listen\nsilent', output: 'YES' },
      { input: 'hello\nworld', output: 'NO' },
      { input: 'triangle\nintegral', output: 'YES' },
      { input: 'abc\nabd', output: 'NO' }
    ]
  },
  {
    id: 'armstrong-number',
    title: 'Armstrong Number Check',
    difficulty: 'Medium',
    tags: ['math'],
    statement: 'Read an integer N and print "YES" if it is an Armstrong number (sum of its own digits each raised to the power of the number of digits equals the number itself), otherwise print "NO".',
    sampleInput: '153',
    sampleOutput: 'YES',
    testCases: [
      { input: '153', output: 'YES' },
      { input: '123', output: 'NO' },
      { input: '9474', output: 'YES' },
      { input: '10', output: 'NO' }
    ]
  },
  {
    id: 'even-or-odd',
    title: 'Even or Odd',
    difficulty: 'Easy',
    tags: ['math', 'basics'],
    statement: 'Read an integer N and print "EVEN" if it is even, otherwise print "ODD".',
    sampleInput: '4',
    sampleOutput: 'EVEN',
    testCases: [
      { input: '4', output: 'EVEN' },
      { input: '7', output: 'ODD' },
      { input: '0', output: 'EVEN' },
      { input: '-3', output: 'ODD' }
    ]
  },
  {
    id: 'sum-of-digits',
    title: 'Sum of Digits',
    difficulty: 'Easy',
    tags: ['math', 'basics'],
    statement: 'Read a positive integer N and print the sum of its digits.',
    sampleInput: '1234',
    sampleOutput: '10',
    testCases: [
      { input: '1234', output: '10' },
      { input: '5', output: '5' },
      { input: '999', output: '27' },
      { input: '1000', output: '1' }
    ]
  },
  {
    id: 'gcd-two-numbers',
    title: 'GCD of Two Numbers',
    difficulty: 'Easy',
    tags: ['math'],
    statement: 'Read two space-separated positive integers A and B and print their greatest common divisor (GCD).',
    sampleInput: '12 18',
    sampleOutput: '6',
    testCases: [
      { input: '12 18', output: '6' },
      { input: '7 13', output: '1' },
      { input: '100 75', output: '25' },
      { input: '8 8', output: '8' }
    ]
  },
  {
    id: 'count-words',
    title: 'Count Words in a Sentence',
    difficulty: 'Easy',
    tags: ['strings'],
    statement: 'Read a line of text and print the number of words in it (words are separated by single spaces).',
    sampleInput: 'The quick brown fox',
    sampleOutput: '4',
    testCases: [
      { input: 'The quick brown fox', output: '4' },
      { input: 'Hello', output: '1' },
      { input: 'a b c d e', output: '5' },
      { input: 'One two three', output: '3' }
    ]
  },
  {
    id: 'second-largest',
    title: 'Second Largest in Array',
    difficulty: 'Medium',
    tags: ['arrays'],
    statement: 'Read an integer N, then N space-separated integers. Print the second largest distinct value in the array.',
    sampleInput: '5\n10 20 4 45 99',
    sampleOutput: '45',
    testCases: [
      { input: '5\n10 20 4 45 99', output: '45' },
      { input: '4\n1 2 3 4', output: '3' },
      { input: '6\n7 7 8 8 9 9', output: '8' },
      { input: '3\n100 90 100', output: '90' }
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Medium',
    tags: ['arrays', 'searching'],
    statement: 'Read an integer N, then N space-separated integers sorted in ascending order, then an integer X. Print the 0-based index of X if it is present, otherwise print -1.',
    sampleInput: '5\n1 3 5 7 9\n7',
    sampleOutput: '3',
    testCases: [
      { input: '5\n1 3 5 7 9\n7', output: '3' },
      { input: '5\n1 3 5 7 9\n2', output: '-1' },
      { input: '1\n42\n42', output: '0' },
      { input: '6\n2 4 6 8 10 12\n12', output: '5' }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    tags: ['strings', 'stack'],
    statement: "Read a string containing only the characters '(', ')', '{', '}', '[' and ']'. Print \"YES\" if every bracket is properly closed and nested, otherwise print \"NO\".",
    sampleInput: '({[]})',
    sampleOutput: 'YES',
    testCases: [
      { input: '({[]})', output: 'YES' },
      { input: '(]', output: 'NO' },
      { input: '()[]{}', output: 'YES' },
      { input: '(((', output: 'NO' }
    ]
  },
  {
    id: 'longest-word',
    title: 'Longest Word in a Sentence',
    difficulty: 'Medium',
    tags: ['strings'],
    statement: 'Read a line of text and print the longest word in it. If multiple words share the maximum length, print the first one that appears.',
    sampleInput: 'I love programming languages',
    sampleOutput: 'programming',
    testCases: [
      { input: 'I love programming languages', output: 'programming' },
      { input: 'cat dog bird', output: 'bird' },
      { input: 'aa bb cc', output: 'aa' },
      { input: 'The quick brown fox jumps', output: 'quick' }
    ]
  },
  {
    id: 'rotate-array-right',
    title: 'Rotate Array Right by K',
    difficulty: 'Medium',
    tags: ['arrays'],
    statement: 'Read an integer N, then N space-separated integers, then an integer K. Rotate the array to the right by K steps (K may be greater than N) and print the result, space-separated.',
    sampleInput: '5\n1 2 3 4 5\n2',
    sampleOutput: '4 5 1 2 3',
    testCases: [
      { input: '5\n1 2 3 4 5\n2', output: '4 5 1 2 3' },
      { input: '4\n1 2 3 4\n1', output: '4 1 2 3' },
      { input: '3\n1 2 3\n3', output: '1 2 3' },
      { input: '6\n1 2 3 4 5 6\n8', output: '5 6 1 2 3 4' }
    ]
  },
  {
    id: 'lcs-length',
    title: 'Longest Common Subsequence Length',
    difficulty: 'Hard',
    tags: ['strings', 'dp'],
    statement: 'Read two strings on two separate lines and print the length of their longest common subsequence.',
    sampleInput: 'ABCBDAB\nBDCABA',
    sampleOutput: '4',
    testCases: [
      { input: 'ABCBDAB\nBDCABA', output: '4' },
      { input: 'abc\nabc', output: '3' },
      { input: 'abc\nxyz', output: '0' },
      { input: 'AGGTAB\nGXTXAYB', output: '4' }
    ]
  },
  {
    id: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Hard',
    tags: ['strings', 'dp'],
    statement: 'Read a string and print its longest palindromic substring. If multiple substrings share the maximum length, print the one that starts first (leftmost).',
    sampleInput: 'babad',
    sampleOutput: 'bab',
    testCases: [
      { input: 'babad', output: 'bab' },
      { input: 'cbbd', output: 'bb' },
      { input: 'a', output: 'a' },
      { input: 'forgeeksskeegfor', output: 'geeksskeeg' }
    ]
  },
  {
    id: 'merge-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'Hard',
    tags: ['arrays', 'sorting'],
    statement: 'Read an integer N, then N lines each containing two space-separated integers (start and end of an interval). Merge all overlapping intervals and print the result sorted by start, each as "start,end", space-separated on one line.',
    sampleInput: '4\n1 3\n2 6\n8 10\n15 18',
    sampleOutput: '1,6 8,10 15,18',
    testCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1,6 8,10 15,18' },
      { input: '2\n1 4\n4 5', output: '1,5' },
      { input: '3\n1 4\n0 4\n3 6', output: '0,6' },
      { input: '1\n5 7', output: '5,7' }
    ]
  },
  {
    id: 'two-sum-indices',
    title: 'Two Sum — Return Indices',
    difficulty: 'Hard',
    tags: ['arrays', 'hashing'],
    statement: 'Read an integer N, then N space-separated integers, then an integer TARGET. Print the two 0-based indices (space-separated, smaller index first) of the two numbers that add up to TARGET. Exactly one valid pair exists.',
    sampleInput: '4\n2 7 11 15\n9',
    sampleOutput: '0 1',
    testCases: [
      { input: '4\n2 7 11 15\n9', output: '0 1' },
      { input: '3\n3 2 4\n6', output: '1 2' },
      { input: '2\n3 3\n6', output: '0 1' },
      { input: '5\n2 5 3 9 11\n8', output: '1 2' }
    ]
  },
  {
    id: 'nth-prime',
    title: 'Nth Prime Number',
    difficulty: 'Hard',
    tags: ['math'],
    statement: 'Read an integer N and print the Nth prime number (1-indexed, where the 1st prime is 2).',
    sampleInput: '6',
    sampleOutput: '13',
    testCases: [
      { input: '6', output: '13' },
      { input: '1', output: '2' },
      { input: '10', output: '29' },
      { input: '15', output: '47' }
    ]
  }
];

export const getQuestionBankEntry = (id) => CODING_QUESTION_BANK.find((q) => q.id === id);
