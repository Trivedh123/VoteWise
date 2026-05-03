const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_votewise_key_123';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user; // { id: userId, email: userEmail }
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  // Check if user exists
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'Email already exists.' });

    // Hash password and insert
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to register user.' });
        
        // Return token
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: this.lastID, name, email } });
      }
    );
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        streak: user.streak, 
        gems: user.gems, 
        current_step: user.current_step 
      } 
    });
  });
});

// --- USER PROGRESS ROUTES ---

app.get('/api/user/progress', authenticateToken, (req, res) => {
  db.get('SELECT streak, gems, current_step FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    
    res.json(row);
  });
});

app.post('/api/user/progress', authenticateToken, (req, res) => {
  const { current_step } = req.body;
  
  if (current_step === undefined) {
    return res.status(400).json({ error: 'Missing current_step' });
  }

  // Update step, give 50 gems for completing a step
  db.run(
    'UPDATE users SET current_step = ?, gems = gems + 50 WHERE id = ?',
    [current_step, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Progress updated successfully' });
    }
  );
});

// --- CHATBOT MOCK ROUTE ---
app.post('/api/chat', authenticateToken, (req, res) => {
  const { message } = req.body;
  // This is where we would connect to Google Gemini API or OpenAI API securely!
  
  setTimeout(() => {
    res.json({
      reply: `That's a great question about "${message}". As an AI, I can tell you that checking your eligibility is the first vital step to participating in an election! 🎉`
    });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`VoteWise API Server running on http://localhost:${PORT}`);
});
