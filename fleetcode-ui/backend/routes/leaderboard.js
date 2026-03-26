const express = require('express');
const router = express.Router();
const Squad = require('../models/Squad');

// 1. GET THE GLOBAL LEADERBOARD
router.get('/', async (req, res) => {
  try {
    // Find all squads, sort by score descending (highest first), limit to top 10
    const squads = await Squad.find().sort({ score: -1 }).limit(10);
    
    // Format the data for the React frontend
    const leaderboard = squads.map((squad, index) => ({
      rank: index + 1,
      name: squad.name,
      score: squad.score || 0,
      streak: squad.streak || 0 
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error("[Leaderboard API] Error:", err.message);
    res.status(500).json({ error: "Failed to fetch leaderboard." });
  }
});

// 2. HACKATHON SEED ROUTE (Use Postman to hit this once)
router.post('/seed', async (req, res) => {
  try {
    const rivalSquads = [
      { name: "Byte Me", score: 1250, streak: 5 },
      { name: "Syntax Errors", score: 840, streak: 3 },
      { name: "O(NO)", score: 420, streak: 1 },
      { name: "Null Pointers", score: 150, streak: 0 }
    ];

    // Insert them into MongoDB directly
    await Squad.insertMany(rivalSquads);

    res.json({ message: "Enemy squads successfully injected into the database." });
  } catch (err) {
    console.error("[Leaderboard API] Seed Error:", err.message);
    res.status(500).json({ error: "Failed to seed database." });
  }
});

module.exports = router;