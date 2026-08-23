const problems = [
    // ─── PROBLEM 1 ── Arrays ── Easy ────────────────────────────────────────────
    {
        id: 1,
        title: "Two Sum",
        functionName: "twoSum",
        difficulty: "Easy",
        description:
            "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]"
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "Each input has exactly one solution.",
            "You may not use the same element twice."
        ],
        starterCode: `function twoSum(nums, target) {
    // Your code here
}`,
        testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6],      expected: [1, 2] },
            { input: [[3, 3], 6],          expected: [0, 1] }
        ]
    },

    // ─── PROBLEM 2 ── Strings ── Easy ───────────────────────────────────────────
    {
        id: 2,
        title: "Valid Palindrome",
        functionName: "isPalindrome",
        difficulty: "Easy",
        description:
            "Given a string, determine whether it is a palindrome after converting uppercase letters to lowercase and removing non-alphanumeric characters.",
        examples: [
            {
                input: 's = "A man, a plan, a canal: Panama"',
                output: "true"
            }
        ],
        constraints: [
            "1 <= s.length <= 2 * 10^5",
            "The string consists of printable ASCII characters."
        ],
        starterCode: `function isPalindrome(s) {
    // Your code here
}`,
        testCases: [
            { input: ["A man, a plan, a canal: Panama"], expected: true  },
            { input: ["race a car"],                     expected: false },
            { input: [" "],                              expected: true  },
            { input: ["Madam"],                          expected: true  }
        ]
    },

    // ─── PROBLEM 3 ── Linked Lists ── Easy ──────────────────────────────────────
    {
        id: 3,
        title: "Reverse Linked List",
        functionName: "reverseList",
        difficulty: "Easy",
        description:
            "Given the head of a singly linked list, reverse the list and return the reversed list.",
        examples: [
            {
                input: "head = [1,2,3,4,5]",
                output: "[5,4,3,2,1]"
            }
        ],
        constraints: [
            "The number of nodes is between 0 and 5000.",
            "-5000 <= Node.val <= 5000"
        ],
        starterCode: `function reverseList(head) {
    // Your code here
}`,
        testCases: [
            { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
            { input: [[1, 2]],           expected: [2, 1]           },
            { input: [[1]],              expected: [1]               },
            { input: [[]],               expected: []                }
        ]
    },

    // ─── PROBLEM 4 ── Arrays ── Easy ────────────────────────────────────────────
    {
        id: 4,
        title: "Best Time to Buy and Sell Stock",
        functionName: "maxProfit",
        difficulty: "Easy",
        description:
            "You are given an array prices where prices[i] is the price of a given stock on the i-th day. " +
            "You want to maximize your profit by choosing a single day to buy and a different day in the future to sell. " +
            "Return the maximum profit you can achieve. If no profit is possible, return 0.",
        examples: [
            {
                input: "prices = [7,1,5,3,6,4]",
                output: "5"
            }
        ],
        constraints: [
            "1 <= prices.length <= 10^5",
            "0 <= prices[i] <= 10^4"
        ],
        starterCode: `function maxProfit(prices) {
    // Your code here
}`,
        testCases: [
            { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
            { input: [[7, 6, 4, 3, 1]],    expected: 0 },
            { input: [[1, 2]],              expected: 1 },
            { input: [[2, 4, 1]],           expected: 2 }
        ]
    },

    // ─── PROBLEM 5 ── Strings ── Easy ───────────────────────────────────────────
    {
        id: 5,
        title: "Valid Anagram",
        functionName: "isAnagram",
        difficulty: "Easy",
        description:
            "Given two strings s and t, return true if t is an anagram of s, and false otherwise. " +
            "An anagram is a word or phrase formed by rearranging the letters of a different word or phrase.",
        examples: [
            {
                input: 's = "anagram", t = "nagaram"',
                output: "true"
            }
        ],
        constraints: [
            "1 <= s.length, t.length <= 5 * 10^4",
            "s and t consist of lowercase English letters."
        ],
        starterCode: `function isAnagram(s, t) {
    // Your code here
}`,
        testCases: [
            { input: ["anagram", "nagaram"], expected: true  },
            { input: ["rat", "car"],         expected: false },
            { input: ["a", "a"],             expected: true  },
            { input: ["ab", "a"],            expected: false }
        ]
    },

    // ─── PROBLEM 6 ── Stack ── Easy ─────────────────────────────────────────────
    {
        id: 6,
        title: "Valid Parentheses",
        functionName: "isValidParentheses",
        difficulty: "Easy",
        description:
            "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', " +
            "determine if the input string is valid. An input string is valid if open brackets are " +
            "closed by the same type of brackets and in the correct order.",
        examples: [
            {
                input: 's = "()[]{}"',
                output: "true"
            }
        ],
        constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses characters only."
        ],
        starterCode: `function isValidParentheses(s) {
    // Your code here
}`,
        testCases: [
            { input: ["()"],     expected: true  },
            { input: ["()[]{]"], expected: false },
            { input: ["(]"],     expected: false },
            { input: ["()[]{}"], expected: true  },
            { input: ["{[]}"],   expected: true  }
        ]
    },

    // ─── PROBLEM 7 ── Trees ── Easy ─────────────────────────────────────────────
    {
        id: 7,
        title: "Maximum Depth of Binary Tree",
        functionName: "maxDepth",
        difficulty: "Easy",
        description:
            "Given the root of a binary tree, return its maximum depth. " +
            "The maximum depth is the number of nodes along the longest path " +
            "from the root node down to the farthest leaf node. " +
            "The tree is represented as a level-order array where null means no node.",
        examples: [
            {
                input: "root = [3,9,20,null,null,15,7]",
                output: "3"
            }
        ],
        constraints: [
            "The number of nodes is in the range [0, 10^4].",
            "-100 <= Node.val <= 100"
        ],
        starterCode: `function maxDepth(root) {
    // Your code here
}`,
        testCases: [
    {
        input: [3, 9, 20, null, null, 15, 7],
        expected: 3
    },
    {
        input: [1, null, 2],
        expected: 2
    },
    {
        input: [],
        expected: 0
    },
    {
        input: [1],
        expected: 1
    }
]
    },

    // ─── PROBLEM 8 ── Hash Maps ── Easy ─────────────────────────────────────────
    {
        id: 8,
        title: "Contains Duplicate",
        functionName: "containsDuplicate",
        difficulty: "Easy",
        description:
            "Given an integer array nums, return true if any value appears at least twice in the array, " +
            "and false if every element is distinct.",
        examples: [
            {
                input: "nums = [1,2,3,1]",
                output: "true"
            }
        ],
        constraints: [
            "1 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9"
        ],
        starterCode: `function containsDuplicate(nums) {
    // Your code here
}`,
        testCases: [
            { input: [[1, 2, 3, 1]],    expected: true  },
            { input: [[1, 2, 3, 4]],    expected: false },
            { input: [[1, 1, 1, 3, 3]], expected: true  },
            { input: [[1]],             expected: false }
        ]
    },

    // ─── PROBLEM 9 ── Two Pointers ── Easy ──────────────────────────────────────
    {
        id: 9,
        title: "Merge Sorted Array",
        functionName: "merge",
        difficulty: "Easy",
        description:
            "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. " +
            "Merge nums2 into nums1 in-place so the result is sorted. " +
            "nums1 has enough space (length m + n). m and n are the initial element counts. " +
            "Return the merged array.",
        examples: [
            {
                input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
                output: "[1,2,2,3,5,6]"
            }
        ],
        constraints: [
            "nums1.length == m + n",
            "nums2.length == n",
            "0 <= m, n <= 200"
        ],
        starterCode: `function merge(nums1, m, nums2, n) {
    // Your code here
    return nums1;
}`,
        testCases: [
            { input: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6] },
            { input: [[1], 1, [], 0],                         expected: [1]                },
            { input: [[0], 0, [1], 1],                        expected: [1]                },
            { input: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3],  expected: [1, 2, 3, 4, 5, 6] }
        ]
    },

    // ─── PROBLEM 10 ── Linked Lists ── Easy ─────────────────────────────────────
    {
        id: 10,
        title: "Merge Two Sorted Lists",
        functionName: "mergeTwoLists",
        difficulty: "Easy",
        description:
            "You are given the heads of two sorted linked lists list1 and list2. " +
            "Merge the two lists into one sorted list and return the head of the merged list. " +
            "Lists are represented as arrays.",
        examples: [
            {
                input: "list1 = [1,2,4], list2 = [1,3,4]",
                output: "[1,1,2,3,4,4]"
            }
        ],
        constraints: [
            "The number of nodes in both lists is in the range [0, 50].",
            "-100 <= Node.val <= 100",
            "Both lists are sorted in non-decreasing order."
        ],
        starterCode: `function mergeTwoLists(list1, list2) {
    // Your code here
}`,
        testCases: [
            { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
            { input: [[], []],               expected: []                  },
            { input: [[], [0]],              expected: [0]                 },
            { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] }
        ]
    },

    // ─── PROBLEM 11 ── Queue ── Easy ─────────────────────────────────────────────
    {
        id: 11,
        title: "Number of Recent Calls",
        functionName: "RecentCounter",
        difficulty: "Easy",
        description:
            "Implement the RecentCounter class that counts the number of recent requests within a certain time frame. " +
            "ping(t) adds a new request at time t and returns the number of requests in the range [t - 3000, t]. " +
            "Simulate a sequence of pings and return the list of counts.",
        examples: [
            {
                input: "pings = [1, 100, 3001, 3002]",
                output: "[1, 2, 3, 3]"
            }
        ],
        constraints: [
            "1 <= t <= 10^9",
            "Each test calls ping with strictly increasing t."
        ],
        starterCode: `function RecentCounter(pings) {
    // Simulate ping sequence and return array of counts
    // Your code here
}`,
        testCases: [
            { input: [[1, 100, 3001, 3002]], expected: [1, 2, 3, 3] },
            { input: [[1]],                  expected: [1]           },
            { input: [[1, 2, 3, 4]],         expected: [1, 2, 3, 4] },
            { input: [[0, 3001, 6002]],       expected: [1, 2, 2]    }
        ]
    },

    // ─── PROBLEM 12 ── Binary Search ── Easy ────────────────────────────────────
    {
        id: 12,
        title: "Binary Search",
        functionName: "binarySearch",
        difficulty: "Easy",
        description:
            "Given an array of integers nums which is sorted in ascending order, and an integer target, " +
            "write a function to search for target in nums. " +
            "If target exists, return its index. Otherwise, return -1.",
        examples: [
            {
                input: "nums = [-1,0,3,5,9,12], target = 9",
                output: "4"
            }
        ],
        constraints: [
            "1 <= nums.length <= 10^4",
            "All integers in nums are unique.",
            "nums is sorted in ascending order."
        ],
        starterCode: `function binarySearch(nums, target) {
    // Your code here
}`,
        testCases: [
            { input: [[-1, 0, 3, 5, 9, 12], 9],  expected: 4  },
            { input: [[-1, 0, 3, 5, 9, 12], 2],  expected: -1 },
            { input: [[1], 1],                     expected: 0  },
            { input: [[1, 3, 5, 7, 9], 7],        expected: 3  }
        ]
    },

    // ─── PROBLEM 13 ── Arrays ── Medium ─────────────────────────────────────────
    {
        id: 13,
        title: "Product of Array Except Self",
        functionName: "productExceptSelf",
        difficulty: "Medium",
        description:
            "Given an integer array nums, return an array answer such that answer[i] is equal to " +
            "the product of all elements of nums except nums[i]. " +
            "The product of any prefix or suffix is guaranteed to fit in a 32-bit integer. " +
            "You must solve it in O(n) time and without using the division operator.",
        examples: [
            {
                input: "nums = [1,2,3,4]",
                output: "[24,12,8,6]"
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^5",
            "-30 <= nums[i] <= 30",
            "The result is guaranteed to fit in a 32-bit integer."
        ],
        starterCode: `function productExceptSelf(nums) {
    // Your code here
}`,
        testCases: [
            { input: [[1, 2, 3, 4]],    expected: [24, 12, 8, 6]    },
            { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
            { input: [[2, 3]],           expected: [3, 2]             },
            { input: [[1, 0]],           expected: [0, 1]             }
        ]
    },

    // ─── PROBLEM 14 ── Two Pointers ── Medium ───────────────────────────────────
    {
        id: 14,
        title: "3Sum",
        functionName: "threeSum",
        difficulty: "Medium",
        description:
            "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] " +
            "such that i, j, k are all distinct indices and nums[i] + nums[j] + nums[k] == 0. " +
            "The solution set must not contain duplicate triplets.",
        examples: [
            {
                input: "nums = [-1,0,1,2,-1,-4]",
                output: "[[-1,-1,2],[-1,0,1]]"
            }
        ],
        constraints: [
            "3 <= nums.length <= 3000",
            "-10^5 <= nums[i] <= 10^5"
        ],
        starterCode: `function threeSum(nums) {
    // Your code here
}`,
        testCases: [
            { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
            { input: [[0, 1, 1]],              expected: []                         },
            { input: [[0, 0, 0]],              expected: [[0, 0, 0]]                },
            { input: [[-2, 0, 1, 1, 2]],       expected: [[-2, 0, 2], [-2, 1, 1]]  }
        ]
    },

    // ─── PROBLEM 15 ── Hash Maps ── Medium ──────────────────────────────────────
    {
        id: 15,
        title: "Group Anagrams",
        functionName: "groupAnagrams",
        difficulty: "Medium",
        description:
            "Given an array of strings strs, group the anagrams together. " +
            "You can return the answer in any order. An anagram is a word formed by " +
            "rearranging all letters of another word.",
        examples: [
            {
                input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
                output: '[["bat"],["nat","tan"],["ate","eat","tea"]]'
            }
        ],
        constraints: [
            "1 <= strs.length <= 10^4",
            "0 <= strs[i].length <= 100",
            "strs[i] consists of lowercase English letters."
        ],
        starterCode: `function groupAnagrams(strs) {
    // Your code here
}`,
        testCases: [
            {
                input:    [["eat", "tea", "tan", "ate", "nat", "bat"]],
                expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
            },
            {
                input:    [[""]],
                expected: [[""]]
            },
            {
                input:    [["a"]],
                expected: [["a"]]
            },
            {
                input:    [["ab", "ba", "abc", "cba", "bca"]],
                expected: [["ab", "ba"], ["abc", "cba", "bca"]]
            }
        ]
    },

    // ─── PROBLEM 16 ── Binary Search ── Medium ──────────────────────────────────
    {
        id: 16,
        title: "Find Minimum in Rotated Sorted Array",
        functionName: "findMin",
        difficulty: "Medium",
        description:
            "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. " +
            "Given the rotated array nums of unique elements, return the minimum element of this array. " +
            "You must write an algorithm that runs in O(log n) time.",
        examples: [
            {
                input: "nums = [3,4,5,1,2]",
                output: "1"
            }
        ],
        constraints: [
            "n == nums.length",
            "1 <= n <= 5000",
            "-5000 <= nums[i] <= 5000",
            "All integers of nums are unique."
        ],
        starterCode: `function findMin(nums) {
    // Your code here
}`,
        testCases: [
            { input: [[3, 4, 5, 1, 2]],    expected: 1 },
            { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
            { input: [[11, 13, 15, 17]],    expected: 11 },
            { input: [[2, 1]],              expected: 1  }
        ]
    },

    // ─── PROBLEM 17 ── Linked Lists ── Medium ───────────────────────────────────
    {
        id: 17,
        title: "Linked List Cycle Detection",
        functionName: "hasCycle",
        difficulty: "Medium",
        description:
            "Given an array representation of a linked list and a pos value indicating which node " +
            "the tail connects back to (forming a cycle), return true if the linked list has a cycle, " +
            "and false otherwise. pos = -1 means no cycle.",
        examples: [
            {
                input: "head = [3,2,0,-4], pos = 1",
                output: "true"
            }
        ],
        constraints: [
            "The number of nodes is in the range [0, 10^4].",
            "-10^5 <= Node.val <= 10^5",
            "pos is -1 or a valid index in the linked list."
        ],
        starterCode: `function hasCycle(head, pos) {
    // Your code here
}`,
        testCases: [
            { input: [[3, 2, 0, -4], 1], expected: true  },
            { input: [[1, 2], 0],         expected: true  },
            { input: [[1], -1],           expected: false },
            { input: [[], -1],            expected: false }
        ]
    },

    // ─── PROBLEM 18 ── Stack ── Medium ──────────────────────────────────────────
    {
        id: 18,
        title: "Daily Temperatures",
        functionName: "dailyTemperatures",
        difficulty: "Medium",
        description:
            "Given an array of integers temperatures representing daily temperatures, return an array answer " +
            "such that answer[i] is the number of days you have to wait after the i-th day to get a warmer temperature. " +
            "If there is no future day with a warmer temperature, answer[i] is 0.",
        examples: [
            {
                input: "temperatures = [73,74,75,71,69,72,76,73]",
                output: "[1,1,4,2,1,1,0,0]"
            }
        ],
        constraints: [
            "1 <= temperatures.length <= 10^5",
            "30 <= temperatures[i] <= 100"
        ],
        starterCode: `function dailyTemperatures(temperatures) {
    // Your code here
}`,
        testCases: [
            { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
            { input: [[30, 40, 50, 60]],                  expected: [1, 1, 1, 0]              },
            { input: [[30, 60, 90]],                      expected: [1, 1, 0]                 },
            { input: [[90, 80, 70, 60]],                  expected: [0, 0, 0, 0]              }
        ]
    },

    // ─── PROBLEM 19 ── Trees ── Medium ──────────────────────────────────────────
    {
        id: 19,
        title: "Binary Tree Level Order Traversal",
        functionName: "levelOrder",
        difficulty: "Medium",
        description:
            "Given the root of a binary tree (as a level-order array), return the level order traversal " +
            "of its nodes' values — i.e., from left to right, level by level.",
        examples: [
            {
                input: "root = [3,9,20,null,null,15,7]",
                output: "[[3],[9,20],[15,7]]"
            }
        ],
        constraints: [
            "The number of nodes in the tree is in the range [0, 2000].",
            "-1000 <= Node.val <= 1000"
        ],
        starterCode: `function levelOrder(root) {
    // Your code here
}`,
        testCases: [
            { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
            { input: [[1]],                            expected: [[1]]                   },
            { input: [[]],                             expected: []                       },
            { input: [[1, 2, 3, 4, 5]],               expected: [[1], [2, 3], [4, 5]]   }
        ]
    },

    // ─── PROBLEM 20 ── Graphs ── Medium ─────────────────────────────────────────
    {
        id: 20,
        title: "Number of Islands",
        functionName: "numIslands",
        difficulty: "Medium",
        description:
            "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), " +
            "return the number of islands. An island is surrounded by water and is formed by connecting " +
            "adjacent lands horizontally or vertically.",
        examples: [
            {
                input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
                output: "1"
            }
        ],
        constraints: [
            "m == grid.length",
            "n == grid[i].length",
            "1 <= m, n <= 300",
            'grid[i][j] is \'0\' or \'1\'.'
        ],
        starterCode: `function numIslands(grid) {
    // Your code here
}`,
        testCases: [
            {
                input: [[
                    ["1","1","1","1","0"],
                    ["1","1","0","1","0"],
                    ["1","1","0","0","0"],
                    ["0","0","0","0","0"]
                ]],
                expected: 1
            },
            {
                input: [[
                    ["1","1","0","0","0"],
                    ["1","1","0","0","0"],
                    ["0","0","1","0","0"],
                    ["0","0","0","1","1"]
                ]],
                expected: 3
            },
            {
                input: [[["1"]]],
                expected: 1
            },
            {
                input: [[["0"]]],
                expected: 0
            }
        ]
    },

    // ─── PROBLEM 21 ── Dynamic Programming ── Medium ────────────────────────────
    {
        id: 21,
        title: "Climbing Stairs",
        functionName: "climbStairs",
        difficulty: "Medium",
        description:
            "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. " +
            "In how many distinct ways can you climb to the top?",
        examples: [
            {
                input: "n = 3",
                output: "3"
            }
        ],
        constraints: [
            "1 <= n <= 45"
        ],
        starterCode: `function climbStairs(n) {
    // Your code here
}`,
        testCases: [
            { input: [1], expected: 1  },
            { input: [2], expected: 2  },
            { input: [3], expected: 3  },
            { input: [5], expected: 8  },
            { input: [10], expected: 89 }
        ]
    },

    // ─── PROBLEM 22 ── Dynamic Programming ── Medium ────────────────────────────
    {
        id: 22,
        title: "House Robber",
        functionName: "rob",
        difficulty: "Medium",
        description:
            "You are a professional robber planning to rob houses along a street. Each house has a certain amount " +
            "of money stashed. Adjacent houses have security connected, so you cannot rob two adjacent houses. " +
            "Given an integer array nums representing the amount of money of each house, return the maximum amount " +
            "you can rob tonight without alerting the police.",
        examples: [
            {
                input: "nums = [1,2,3,1]",
                output: "4"
            }
        ],
        constraints: [
            "1 <= nums.length <= 100",
            "0 <= nums[i] <= 400"
        ],
        starterCode: `function rob(nums) {
    // Your code here
}`,
        testCases: [
            { input: [[1, 2, 3, 1]],       expected: 4  },
            { input: [[2, 7, 9, 3, 1]],    expected: 12 },
            { input: [[1]],                 expected: 1  },
            { input: [[2, 1]],              expected: 2  },
            { input: [[5, 5, 10, 100, 10, 5]], expected: 110 }
        ]
    },

    // ─── PROBLEM 23 ── Strings ── Medium ────────────────────────────────────────
    {
        id: 23,
        title: "Longest Substring Without Repeating Characters",
        functionName: "lengthOfLongestSubstring",
        difficulty: "Medium",
        description:
            "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [
            {
                input: 's = "abcabcbb"',
                output: "3"
            }
        ],
        constraints: [
            "0 <= s.length <= 5 * 10^4",
            "s consists of English letters, digits, symbols and spaces."
        ],
        starterCode: `function lengthOfLongestSubstring(s) {
    // Your code here
}`,
        testCases: [
            { input: ["abcabcbb"], expected: 3 },
            { input: ["bbbbb"],    expected: 1 },
            { input: ["pwwkew"],   expected: 3 },
            { input: [""],        expected: 0 },
            { input: ["dvdf"],    expected: 3 }
        ]
    },

    // ─── PROBLEM 24 ── Graphs ── Medium ─────────────────────────────────────────
    {
        id: 24,
        title: "Clone Graph",
        functionName: "cloneGraph",
        difficulty: "Medium",
        description:
            "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. " +
            "The graph is represented as an adjacency list where each node's neighbors are given as an array of node values. " +
            "Input is the adjacency list. Return the cloned adjacency list.",
        examples: [
            {
                input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
                output: "[[2,4],[1,3],[2,4],[1,3]]"
            }
        ],
        constraints: [
            "The number of nodes is in the range [0, 100].",
            "1 <= Node.val <= 100",
            "Node.val is unique for each node.",
            "The graph is connected."
        ],
        starterCode: `function cloneGraph(adjList) {
    // Your code here
}`,
        testCases: [
            { input: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] },
            { input: [[[]]],                              expected: [[]]                               },
            { input: [[]],                                expected: []                                 },
            { input: [[[2], [1]]],                        expected: [[2], [1]]                         }
        ]
    },

    // ─── PROBLEM 25 ── Trees ── Medium ──────────────────────────────────────────
    {
        id: 25,
        title: "Validate Binary Search Tree",
        functionName: "isValidBST",
        difficulty: "Medium",
        description:
            "Given the root of a binary tree (as a level-order array where null means no node), " +
            "determine if it is a valid binary search tree (BST). " +
            "A BST requires each node's value to be greater than all values in its left subtree " +
            "and less than all values in its right subtree.",
        examples: [
            {
                input: "root = [2,1,3]",
                output: "true"
            }
        ],
        constraints: [
            "The number of nodes in the tree is in the range [1, 10^4].",
            "-2^31 <= Node.val <= 2^31 - 1"
        ],
        starterCode: `function isValidBST(root) {
    // Your code here
}`,
        testCases: [
            { input: [[2, 1, 3]],              expected: true  },
            { input: [[5, 1, 4, null, null, 3, 6]], expected: false },
            { input: [[1]],                    expected: true  },
            { input: [[10, 5, 15, null, null, 6, 20]], expected: false }
        ]
    },

    // ─── PROBLEM 26 ── Dynamic Programming ── Hard ──────────────────────────────
    {
        id: 26,
        title: "Longest Common Subsequence",
        functionName: "longestCommonSubsequence",
        difficulty: "Hard",
        description:
            "Given two strings text1 and text2, return the length of their longest common subsequence. " +
            "A subsequence is a sequence derived by deleting some or no characters without changing the order. " +
            "If there is no common subsequence, return 0.",
        examples: [
            {
                input: 'text1 = "abcde", text2 = "ace"',
                output: "3"
            }
        ],
        constraints: [
            "1 <= text1.length, text2.length <= 1000",
            "text1 and text2 consist of only lowercase English characters."
        ],
        starterCode: `function longestCommonSubsequence(text1, text2) {
    // Your code here
}`,
        testCases: [
            { input: ["abcde", "ace"],  expected: 3 },
            { input: ["abc", "abc"],    expected: 3 },
            { input: ["abc", "def"],    expected: 0 },
            { input: ["ezupkr", "ubmrapg"], expected: 2 },
            { input: ["hofubmnylkra", "pqhumbjgra"], expected: 6 }
        ]
    },

    // ─── PROBLEM 27 ── Graphs ── Hard ───────────────────────────────────────────
    {
        id: 27,
        title: "Word Ladder",
        functionName: "ladderLength",
        difficulty: "Hard",
        description:
            "Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in " +
            "the shortest transformation sequence from beginWord to endWord, such that only one letter can be " +
            "changed at a time and each intermediate word must exist in wordList. Return 0 if no sequence exists.",
        examples: [
            {
                input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
                output: "5"
            }
        ],
        constraints: [
            "1 <= beginWord.length <= 10",
            "endWord.length == beginWord.length",
            "1 <= wordList.length <= 5000",
            "All words are lowercase English letters."
        ],
        starterCode: `function ladderLength(beginWord, endWord, wordList) {
    // Your code here
}`,
        testCases: [
            { input: ["hit", "cog", ["hot","dot","dog","lot","log","cog"]], expected: 5 },
            { input: ["hit", "cog", ["hot","dot","dog","lot","log"]],       expected: 0 },
            { input: ["a",   "c",   ["a","b","c"]],                          expected: 2 },
            { input: ["hot", "dog", ["hot","dog"]],                           expected: 0 }
        ]
    },

    // ─── PROBLEM 28 ── Dynamic Programming ── Hard ──────────────────────────────
    {
        id: 28,
        title: "Edit Distance",
        functionName: "minDistance",
        difficulty: "Hard",
        description:
            "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. " +
            "Allowed operations: Insert a character, Delete a character, Replace a character.",
        examples: [
            {
                input: 'word1 = "horse", word2 = "ros"',
                output: "3"
            }
        ],
        constraints: [
            "0 <= word1.length, word2.length <= 500",
            "word1 and word2 consist of lowercase English letters."
        ],
        starterCode: `function minDistance(word1, word2) {
    // Your code here
}`,
        testCases: [
            { input: ["horse", "ros"],       expected: 3 },
            { input: ["intention", "execution"], expected: 5 },
            { input: ["", "a"],              expected: 1 },
            { input: ["a", ""],              expected: 1 },
            { input: ["abc", "abc"],         expected: 0 }
        ]
    },

    // ─── PROBLEM 29 ── Arrays ── Hard ───────────────────────────────────────────
    {
        id: 29,
        title: "Trapping Rain Water",
        functionName: "trap",
        difficulty: "Hard",
        description:
            "Given n non-negative integers representing an elevation map where the width of each bar is 1, " +
            "compute how much water it can trap after raining.",
        examples: [
            {
                input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                output: "6"
            }
        ],
        constraints: [
            "n == height.length",
            "1 <= n <= 2 * 10^4",
            "0 <= height[i] <= 10^5"
        ],
        starterCode: `function trap(height) {
    // Your code here
}`,
        testCases: [
            { input: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 },
            { input: [[4,2,0,3,2,5]],              expected: 9 },
            { input: [[1,0,1]],                    expected: 1 },
            { input: [[3,0,2,0,4]],                expected: 7 },
            { input: [[1]],                        expected: 0 }
        ]
    },

    // ─── PROBLEM 30 ── Strings ── Hard ──────────────────────────────────────────
    {
        id: 30,
        title: "Minimum Window Substring",
        functionName: "minWindow",
        difficulty: "Hard",
        description:
            "Given two strings s and t, return the minimum window substring of s such that every character in t " +
            "(including duplicates) is included in the window. If there is no such substring, return an empty string.",
        examples: [
            {
                input: 's = "ADOBECODEBANC", t = "ABC"',
                output: '"BANC"'
            }
        ],
        constraints: [
            "1 <= s.length <= 10^5",
            "1 <= t.length <= 10^4",
            "s and t consist of uppercase and lowercase English letters."
        ],
        starterCode: `function minWindow(s, t) {
    // Your code here
}`,
        testCases: [
            { input: ["ADOBECODEBANC", "ABC"], expected: "BANC"    },
            { input: ["a", "a"],               expected: "a"        },
            { input: ["a", "aa"],              expected: ""         },
            { input: ["aa", "aa"],             expected: "aa"       },
            { input: ["cabwefgewcwaefgcf", "cae"], expected: "cwae" }
        ]
    }
];

export default problems;