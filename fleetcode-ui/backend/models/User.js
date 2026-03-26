const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fleetCodeId: { type: String, required: true, unique: true }, // e.g., "Sandeep"
  password: { type: String, required: true }, // Hashed
  leetCodeUsername: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // Turns true after Radar Handshake
  squadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Squad', default: null },
  
  // Data for the MuscleMap.jsx radar chart
  radarStats: {
    Arrays: { type: Number, default: 0 },
    DP: { type: Number, default: 0 },
    Trees: { type: Number, default: 0 },
    Strings: { type: Number, default: 0 },
    Math: { type: Number, default: 0 },
    Graphs: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);