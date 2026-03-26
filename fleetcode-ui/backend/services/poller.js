const cron = require('node-cron');
const axios = require('axios');
const User = require('../models/User');
const Squad = require('../models/Squad');
const Activity = require('../models/Activity');

// LeetCode GraphQL API query
const LEETCODE_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
    }
  }
`;

const runRadarSweep = async () => {
  console.log("=========================================");
  console.log("[CRON] 📡 INITIATING GLOBAL RADAR SWEEP...");
  
  try {
    // 1. Get all users who are verified and belong to a squad
    const activeOperators = await User.find({ isVerified: true, squadId: { $ne: null } });
    console.log(`[CRON] Found ${activeOperators.length} active operators in the field.`);

    for (let user of activeOperators) {
      console.log(`[CRON] Scanning ${user.leetCodeUsername}...`);
      
      try {
        // 2. Fetch their last 10 accepted submissions from LeetCode
        const response = await axios.post('https://leetcode.com/graphql', {
          query: LEETCODE_QUERY,
          variables: { username: user.leetCodeUsername, limit: 10 }
        }, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const submissions = response.data?.data?.recentAcSubmissionList || [];

        // 3. Process each submission
        for (let sub of submissions) {
          // Convert string timestamp to a real Date object
          const solvedDate = new Date(parseInt(sub.timestamp) * 1000);

          // 🔥 THE FIX: Check if they have EVER received points for this specific problem
          const existingActivity = await Activity.findOne({
            user: user._id,
            problemSlug: sub.titleSlug
          });

          // Ensure they actually solved this AFTER they registered for FleetCode
          // (Fallback to 0 if user.createdAt is somehow missing from old test accounts)
          const registeredAt = user.createdAt ? user.createdAt.getTime() : 0; 
          const solvedAtTime = solvedDate.getTime();

          // If they haven't gotten points for this yet, AND they solved it after joining: Award XP!
          if (!existingActivity && solvedAtTime >= (registeredAt - 60000)) { 
            console.log(`[CRON] 🎯 NEW SOLVE DETECTED: ${user.fleetCodeId} solved ${sub.title}`);

            // A. Save the Activity to the feed
            const newActivity = new Activity({
              user: user._id,
              squad: user.squadId,
              problemName: sub.title,
              problemSlug: sub.titleSlug,
              solvedAt: solvedDate,
              xpAwarded: 10 
            });
            await newActivity.save();

            // B. Add 10 XP to the Squad's Total Score
            await Squad.findByIdAndUpdate(user.squadId, { $inc: { score: 10 } });
          }
        }
      } catch (err) {
        console.error(`[CRON] ❌ Failed to scan ${user.leetCodeUsername}:`, err.message);
      }
    }
    
    console.log("[CRON] ✅ GLOBAL RADAR SWEEP COMPLETE.");
    console.log("=========================================\n");

  } catch (err) {
    console.error("[CRON] CRITICAL ENGINE FAILURE:", err);
  }
};

// Start the Cron Job
const startPoller = () => {
  // Running every 30 seconds for Hackathon Mode
  cron.schedule('*/30 * * * * *', () => {
    runRadarSweep();
  });
  
  console.log("⚙️  Auto-Poller Engine Armed. Sweeping every 30 seconds.");
};

module.exports = { startPoller, runRadarSweep };