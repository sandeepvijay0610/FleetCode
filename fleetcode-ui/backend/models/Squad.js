const mongoose = require('mongoose');

const SquadSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Tee-Toddlers"
  score: { type: Number, default: 0 }, // Total XP for the Leaderboard
  streak: { type: Number, default: 0 },
  spotterTokens: { type: Number, default: 1 }, // Used in SpotterModal.jsx
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Squad', SquadSchema);