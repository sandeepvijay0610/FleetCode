const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Squad = require('../models/Squad');

// 1. FORM A SQUAD
router.post('/create', async (req, res) => {
  try {
    const { username, squad_name } = req.body;

    // Check if squad name is already taken
    const existingSquad = await Squad.findOne({ name: squad_name });
    if (existingSquad) {
      return res.status(400).json({ error: "Designation already in use by another unit." });
    }

    const user = await User.findOne({ fleetCodeId: username });
    if (!user) return res.status(404).json({ error: "Operator not found." });

    // If user is already in a squad, they must leave it first
    if (user.squadId) {
      return res.status(400).json({ error: "Operator is already assigned to a squad." });
    }

    // Create the new squad and add the creator as the first member
    const newSquad = new Squad({
      name: squad_name,
      members: [user._id]
    });
    await newSquad.save();

    // Update the user's profile with their new squad ID
    user.squadId = newSquad._id;
    await user.save();

    res.status(201).json({ message: "Squad initialized successfully.", squad_name: newSquad.name });

  } catch (err) {
    console.error("[Squad API] Create Error:", err.message);
    res.status(500).json({ error: "Server failed to initialize squad." });
  }
});

// 2. JOIN A SQUAD
router.post('/join', async (req, res) => {
  try {
    const { username, squad_id } = req.body; // In your UI, squad_id is the squad name

    const user = await User.findOne({ fleetCodeId: username });
    if (!user) return res.status(404).json({ error: "Operator not found." });

    if (user.squadId) {
      return res.status(400).json({ error: "Operator is already assigned to a squad." });
    }

    // Find the squad by name
    const squad = await Squad.findOne({ name: squad_id });
    if (!squad) {
      return res.status(404).json({ error: "Squad designation not found." });
    }

    // Optional limit: 4 members max (as per your PPT)
    if (squad.members.length >= 4) {
      return res.status(400).json({ error: "Squad is currently at maximum capacity (4/4)." });
    }

    // Add user to squad and update user
    squad.members.push(user._id);
    await squad.save();

    user.squadId = squad._id;
    await user.save();

    res.json({ message: "Link established. Welcome to the squad.", squad_name: squad.name });

  } catch (err) {
    console.error("[Squad API] Join Error:", err.message);
    res.status(500).json({ error: "Server failed to establish link." });
  }
});

// 3. LEAVE A SQUAD
// 3. LEAVE A SQUAD
router.post('/leave', async (req, res) => {
  try {
    const { username } = req.body;
    console.log(`[Squad API] Initiating LEAVE protocol for Operator: ${username}`); // <-- ADD THIS

    const user = await User.findOne({ fleetCodeId: username });
    if (!user || !user.squadId) {
      console.log(`[Squad API] ❌ Operator not in a squad or not found.`); // <-- ADD THIS
      return res.status(400).json({ error: "Operator is not in a squad." });
    }

    const squad = await Squad.findById(user.squadId);
    if (squad) {
      squad.members = squad.members.filter(memberId => memberId.toString() !== user._id.toString());
      await squad.save();
      console.log(`[Squad API] ✅ Removed ${username} from squad: ${squad.name}`); // <-- ADD THIS
    }

    // Clear the user's squad link
    user.squadId = null;
    await user.save();
    console.log(`[Squad API] ✅ Database updated. Link severed.`); // <-- ADD THIS

    res.json({ message: "Operator has abandoned the squad." });

  } catch (err) {
    console.error("[Squad API] Leave Error:", err.message);
    res.status(500).json({ error: "Failed to sever squad link." });
  }
});

const { runRadarSweep } = require('../services/poller');

// 🔥 HACKATHON DEMO ROUTE: FORCE A RADAR SWEEP NOW
router.get('/force-sync', async (req, res) => {
  try {
    // Run the engine instantly without waiting for the cron timer
    await runRadarSweep();
    res.json({ message: "Manual radar sweep executed. XP awarded." });
  } catch (err) {
    res.status(500).json({ error: "Manual sweep failed." });
  }
});

module.exports = router;