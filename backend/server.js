const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Email Transporter (Mock for now, update with real creds in .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Check if user exists, else create
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user });
      } else {
        // Create new user (random password since they use Google)
        const dummyPassword = crypto.randomBytes(16).toString('hex');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(dummyPassword, salt);

        db.run(
          'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
          [name, email, hash],
          function (err) {
            if (err) return res.status(500).json({ error: 'Failed to create user' });
            
            const newUser = { id: this.lastID, name, email, streak: 0, gems: 0, current_step: 0 };
            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, user: newUser });
          }
        );
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

// --- PASSWORD RESET ROUTES ---

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    db.run(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [token, expiry.toISOString(), user.id],
      async (err) => {
        if (err) return res.status(500).json({ error: 'Failed to set reset token' });

        // In a real app, send email. For demo, log it and return it.
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        console.log(`Password reset link: ${resetLink}`);

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          try {
            await transporter.sendMail({
              from: '"VoteWise" <noreply@votewise.com>',
              to: email,
              subject: 'Password Reset Request',
              text: `You requested a password reset. Click here: ${resetLink}`,
              html: `<p>You requested a password reset. <a href="${resetLink}">Click here to reset your password</a></p>`
            });
          } catch (e) {
            console.error('Email send failed:', e);
          }
        }

        res.json({ message: 'Reset link generated. Check console or email.', link: resetLink });
      }
    );
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  db.get(
    'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > ?',
    [token, new Date().toISOString()],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);

      db.run(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [hash, user.id],
        (err) => {
          if (err) return res.status(500).json({ error: 'Failed to reset password' });
          res.json({ message: 'Password reset successful' });
        }
      );
    }
  );
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

// Catch-all to serve the frontend for any other routes
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VoteWise API Server running on http://localhost:${PORT}`);
});
