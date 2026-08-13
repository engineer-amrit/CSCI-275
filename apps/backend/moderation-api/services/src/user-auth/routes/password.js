const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const router = express.Router();

// ---------- Password Management ----------
// Note: for the demo, instead of emailing the reset link, we just display it
// on screen ("simulated email"). Swap this for nodemailer once you have SMTP set up.

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { message: null, resetLink: null });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    // Don't reveal whether the email exists — just show a generic message
    return res.render('forgot-password', {
      message: 'If that email exists, a reset link has been generated.',
      resetLink: null,
    });
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [token, expires, user.id]
  );

  const resetLink = `/reset-password/${token}`;
  res.render('forgot-password', {
    message: 'Reset link generated (simulated email — shown below for demo purposes):',
    resetLink,
  });
});

router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const result = await pool.query(
    'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [token]
  );

  if (result.rows.length === 0) {
    return res.render('error', { message: 'This reset link is invalid or has expired.' });
  }

  res.render('reset-password', { token, error: null });
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password, confirm_password } = req.body;

  const result = await pool.query(
    'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [token]
  );
  const user = result.rows[0];

  if (!user) {
    return res.render('error', { message: 'This reset link is invalid or has expired.' });
  }
  if (!password || password.length < 6) {
    return res.render('reset-password', { token, error: 'Password must be at least 6 characters.' });
  }
  if (password !== confirm_password) {
    return res.render('reset-password', { token, error: 'Passwords do not match.' });
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [hash, user.id]
  );

  res.render('login', { error: 'Password updated! You can now log in.' });
});

module.exports = router;
