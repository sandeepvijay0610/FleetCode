// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { startPoller } = require('./services/poller');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Crucial for connecting React to Node
app.use(express.json());
// Connect the Auth routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/squad', require('./routes/squad'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fleetcode')
  .then(() => console.log('MongoDB Connected to FleetCode Database'))
  .catch(err => console.log(err));

// Routes (We will create these next)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/squad', require('./routes/squad'));
// app.use('/api', require('./routes/dashboard'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`FleetCode Server running on port ${PORT}`));

startPoller();

app.listen(PORT, () => {
  console.log(`FleetCode Server running on port ${PORT}`);
});