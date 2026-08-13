const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const router = express.Router();

// ---------- Registration & Onboarding ----------
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/profile');
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { name, email, password, avatar_url, tos } = req.body;

  if (!name || !email || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.render('register', { error: 'Password must be at least 6 characters.' });
  }
  // Terms of Service checkbox validation
  if (!tos) {
    return res.render('register', { error: 'You must accept the Terms of Service and Privacy Policy to continue.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.render('register', { error: 'An account with that email already exists. Try logging in instead.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hour expiry

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, avatar_url, verification_token, verification_token_expires)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, hash, avatar_url || '', verificationToken, tokenExpires]
    );

    // Simulated email — in production this would be sent via a real email service (e.g. SendGrid, Nodemailer + SMTP)
    const verifyLink = `/verify/${verificationToken}`;

    res.render('check-inbox', { email, verifyLink });
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Something went wrong. Please try again.' });
  }
});

// ---------- Email Verification ----------
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  const result = await pool.query(
    'SELECT id, name FROM users WHERE verification_token = $1 AND verification_token_expires > NOW()',
    [token]
  );
  const user = result.rows[0];

  if (!user) {
    return res.render('verify-expired', { });
  }

  await pool.query(
    'UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1',
    [user.id]
  );

  res.render('verify-success', { name: user.name });
});

router.get('/resend-verification', (req, res) => {
  res.render('resend-verification', { message: null, verifyLink: null });
});

router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  const result = await pool.query(
    'SELECT id, email_verified FROM users WHERE email = $1',
    [email]
  );
  const user = result.rows[0];

  if (!user) {
    return res.render('resend-verification', {
      message: 'If that email exists in our system, a new verification link has been generated.',
      verifyLink: null,
    });
  }
  if (user.email_verified) {
    return res.render('resend-verification', {
      message: 'That email is already verified — you can log in normally.',
      verifyLink: null,
    });
  }

  const verificationToken = crypto.randomBytes(20).toString('hex');
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await pool.query(
    'UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE id = $3',
    [verificationToken, tokenExpires, user.id]
  );

  res.render('resend-verification', {
    message: 'New verification link generated (simulated email — shown below for demo purposes):',
    verifyLink: `/verify/${verificationToken}`,
  });
});

// ---------- Authentication & Sessions ----------
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/profile');
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    if (user.banned) {
      return res.render('login', { error: 'This account has been suspended. Contact support for details.' });
    }

    req.session.userId = user.id;
    req.session.role = user.role;
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Please try again.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;