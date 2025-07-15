// For future: import adminOnly middleware
// const adminOnly = require('./adminOnly');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fullstackdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Example Mongoose model
const Item = mongoose.model('Item', new mongoose.Schema({
  name: String,
  value: Number,
}));

// User
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  hasVoted: { type: Boolean, default: false },
  role: { type: String, enum: ['admin', 'voter'], default: 'voter' }
}));

// API endpoints
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});


// Example voting endpoint
// Voting endpoint (voters only)
app.post('/api/vote', async (req, res) => {
  const { email, vote } = req.body;
  if (!email || !vote) return res.status(400).json({ error: 'Email and vote are required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') {
    return res.status(403).json({ error: 'Admins cannot vote' });
  }
  if (user.hasVoted) {
    return res.status(403).json({ error: 'You already voted' });
  }
  // Here you would record the vote (e.g., update an Election collection)
  user.hasVoted = true;
  await user.save();
  res.json({ message: 'Vote recorded' });
});

app.post('/api/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.status(201).json(item);
});

// Admin endpoint to add users (admin only)
app.post('/api/users', async (req, res) => {
  // In production, use adminOnly middleware
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (role && !['admin', 'voter'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = new User({ email, role: role || 'voter' });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Admin endpoint to delete users (admin only)
app.delete('/api/users/:email', async (req, res) => {
  // In production, use adminOnly middleware
  try {
    const { email } = req.params;
    const result = await User.deleteOne({ email });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Admin monitoring endpoint: list all users
app.get('/api/users', async (req, res) => {
  // In production, use adminOnly middleware
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
