const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Squad = require('../models/Squad');
const Activity = require('../models/Activity');

const TAG_MAP = {
  'Graph': 'graph', 'Greedy': 'greedy', 'Sliding Window': 'sliding-window',
  'Binary Search': 'binary-search', 'Backtracking': 'backtracking', 'Dynamic Programming': 'dynamic-programming'
};

const TOPIC_STRINGS = {
  'Graph': ["Graph", "Depth-First Search", "Breadth-First Search", "Topological Sort"],
  'Greedy': ["Greedy"], 'Sliding Window': ["Sliding Window"], 'Binary Search': ["Binary Search"],
  'Backtracking': ["Recursion", "Backtracking"], 'Dynamic Programming': ["Dynamic Programming"]
};

// Helper function to fetch LeetCode stats for any user
async function getMemberStats(leetCodeUsername) {
  try {
    const res = await axios.post('https://leetcode.com/graphql', {
      query: `query skillStats($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            advanced { tagName problemsSolved }
            intermediate { tagName problemsSolved }
            fundamental { tagName problemsSolved }
          }
        }
      }`,
      variables: { username: leetCodeUsername }
    }, { timeout: 3000 });

    const tags = res.data?.data?.matchedUser?.tagProblemCounts;
    if (!tags) return null;

    const getScore = (tagNames) => {
      let s = 0;
      if (tags.fundamental) tags.fundamental.forEach(t => { if (tagNames.includes(t.tagName)) s += t.problemsSolved * 1; });
      if (tags.intermediate) tags.intermediate.forEach(t => { if (tagNames.includes(t.tagName)) s += t.problemsSolved * 2; });
      if (tags.advanced) tags.advanced.forEach(t => { if (tagNames.includes(t.tagName)) s += t.problemsSolved * 3; });
      return Math.max(s, 1);
    };

    return Object.keys(TOPIC_STRINGS).map(topic => ({
      subject: topic,
      A: getScore(TOPIC_STRINGS[topic])
    }));
  } catch (err) { return null; }
}

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ fleetCodeId: req.params.username });
    if (!user || !user.squadId) return res.json({ hasSquad: false });

    const squad = await Squad.findById(user.squadId).populate('members');
    
    // 1. Calculate Rank
    const higherScoring = await Squad.countDocuments({ score: { $gt: squad.score || 0 } });
    
    // 2. FETCH TEAM ROSTER DATA (Muscle Maps for everyone)
    const roster = await Promise.all(squad.members.map(async (m) => {
      const stats = await getMemberStats(m.leetCodeUsername);
      return {
        fleetCodeId: m.fleetCodeId,
        leetCodeUsername: m.leetCodeUsername,
        muscleMap: stats || [
          { subject: 'Graph', A: 5 }, { subject: 'Greedy', A: 5 }, 
          { subject: 'Sliding Window', A: 5 }, { subject: 'Binary Search', A: 5 }, 
          { subject: 'Backtracking', A: 5 }, { subject: 'Dynamic Programming', A: 5 }
        ]
      };
    }));

    // 3. TARGET RECOMMENDER (For the logged-in user)
    const myStats = roster.find(r => r.fleetCodeId === req.params.username)?.muscleMap;
    let weakestTopic = "Graph";
    let minScore = Infinity;
    myStats.forEach(d => { if (d.A < minScore) { minScore = d.A; weakestTopic = d.subject; } });

    // Live Problem Fetch (Corrected GraphQL)
    const probRes = await axios.post('https://leetcode.com/graphql', {
      query: `query probList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
          data { title titleSlug difficulty }
        }
      }`,
      variables: { categorySlug: "", limit: 20, skip: 0, filters: { tags: [TAG_MAP[weakestTopic]] } }
    }, { timeout: 5000 });

    const liveProbs = probRes.data?.data?.questionList?.data || [];
    const solved = (await Activity.find({ user: user._id })).map(a => a.problemSlug);
    const unsolved = liveProbs.find(p => !solved.includes(p.titleSlug)) || liveProbs[0];

    res.json({
      hasSquad: true,
      squadName: squad.name,
      score: squad.score || 0,
      rank: higherScoring + 1,
      streak: squad.streak || 0,
      roster: roster, // Full list of teammates + their glyphs
      target: {
        title: unsolved.title,
        slug: unsolved.titleSlug,
        difficulty: unsolved.difficulty,
        url: `https://leetcode.com/problems/${unsolved.titleSlug}/`
      },
      weakestTopic: weakestTopic
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;