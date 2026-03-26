const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('../models/User');
const Squad = require('../models/Squad'); // <-- ADD THIS LINE

// 1. REGISTER: Initializes the Operator (but they are unverified)
router.post('/register', async (req, res) => {
  try {
    const { username, password, leetcode_username } = req.body;

    // Check if the FleetCode ID is already taken
    let user = await User.findOne({ fleetCodeId: username });
    if (user) {
      return res.status(400).json({ error: "FleetCode ID already in use." });
    }

    // Secure the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user profile (Verification pending)
    user = new User({
      fleetCodeId: username,
      password: hashedPassword,
      leetCodeUsername: leetcode_username,
      isVerified: false 
    });

    await user.save();
    res.status(201).json({ message: "Operator initialized. Awaiting Radar Handshake." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// 2. LOGIN: Standard Authentication
// 2. LOGIN: Standard Authentication
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ fleetCodeId: username });
    if (!user) return res.status(400).json({ error: "Invalid Operator ID." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Passcode." });

    if (!user.isVerified) {
      return res.status(403).json({ error: "Account linkage incomplete. Radar verification required." });
    }

    // --- THE FIX: FETCH THEIR SQUAD NAME IF THEY HAVE ONE ---
    let squadName = null;
    if (user.squadId) {
      const squad = await Squad.findById(user.squadId);
      if (squad) squadName = squad.name;
    }

    // Send the squadName back to React!
    res.json({ 
      message: "Authentication successful", 
      username: user.fleetCodeId,
      squadName: squadName 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// 3. RADAR VERIFICATION: The Polling Endpoint
router.get('/verify/:username', async (req, res) => {
  try {
    const user = await User.findOne({ fleetCodeId: req.params.username });
    if (!user) return res.status(404).json({ error: "Operator not found." });
    
    // If already verified, instantly return true
    if (user.isVerified) return res.json({ verified: true });

    // --- BULLETPROOF LEETCODE API CALL ---
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            titleSlug
            timestamp
          }
        }
      `,
      variables: { username: user.leetCodeUsername, limit: 1 }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://leetcode.com/',
        'Origin': 'https://leetcode.com'
      }
    });

    const submissions = response.data?.data?.recentAcSubmissionList;

    if (!submissions) {
      console.log(`[Radar] ❌ NO DATA for ${user.leetCodeUsername}.`);
      return res.json({ verified: false });
    }

    console.log(`[Radar] 📡 Scanning ${user.leetCodeUsername}...`);

    // Look for Problem 287
    const targetProblem = submissions.find(sub => sub.titleSlug === 'find-the-duplicate-number');

    if (targetProblem) {
      const submissionTime = parseInt(targetProblem.timestamp);
      
      // 🔥 THE STRICT TIME CHECK 🔥
      // Get the exact second the user registered in MongoDB
      const registeredAt = Math.floor(user.createdAt.getTime() / 1000); 
      
      // Allow a tiny 60-second buffer in case LeetCode's server clock is slightly off
      if (submissionTime >= (registeredAt - 60)) {
        console.log(`[Radar] ✅ STRICT TIME MATCH! Submission occurred AFTER registration. Account linked.`);
        user.isVerified = true; 
        await user.save();
        return res.json({ verified: true });
      } else {
        const diff = registeredAt - submissionTime;
        console.log(`[Radar] ❌ Submission rejected. It is an old submission from ${diff} seconds BEFORE they registered.`);
      }
    }

    // Handshake failed or still waiting
    res.json({ verified: false });

  } catch (err) {
    console.error(`[Radar] 🚨 Server/Axios Error:`, err.message);
    res.json({ verified: false }); 
  }
});

module.exports = router;