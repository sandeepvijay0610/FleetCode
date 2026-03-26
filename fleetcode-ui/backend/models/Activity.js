const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  // Links back to the specific operator
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Links to the squad (Makes generating the Dashboard Live Feed much faster)
  squad: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Squad',
    default: null
  },

  // The actual LeetCode problem details
  problemName: { type: String, required: true }, // e.g., "Find the Duplicate Number"
  problemSlug: { type: String, required: true }, // e.g., "find-the-duplicate-number"
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard', 'Unknown'], 
    default: 'Unknown' 
  },
  
  // The tags (e.g., "Arrays", "Dynamic Programming"). 
  // We use this array to update the User's Radar Stats!
  topics: [{ type: String }], 
  
  // The exact time LeetCode registered the accepted solution
  solvedAt: { type: Date, required: true },

  // How much this specific problem contributed to the Squad's total score
  xpAwarded: { type: Number, default: 10 } 

}, { timestamps: true });

// Optional: Add an index to make querying today's squad activity lightning fast
ActivitySchema.index({ squad: 1, solvedAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);