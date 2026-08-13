const express = require('express');
const pool = require('../db/pool');
const { requireLogin, requireRole } = require('../middleware/auth');
const router = express.Router();

// ---------- User Profile ----------
router.get('/profile', requireLogin, async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, bio, avatar_url, location, role, email_verified, created_at FROM users WHERE id = $1',
    [req.session.userId]
  );
  res.render('profile', { user: result.rows[0], saved: false });
});

router.post('/profile', requireLogin, async (req, res) => {
  const { name, bio, avatar_url, location } = req.body;
  await pool.query(
    'UPDATE users SET name = $1, bio = $2, avatar_url = $3, location = $4 WHERE id = $5',
    [name, bio, avatar_url, location, req.session.userId]
  );
  const result = await pool.query(
    'SELECT id, name, email, bio, avatar_url, location, role, email_verified, created_at FROM users WHERE id = $1',
    [req.session.userId]
  );
  res.render('profile', { user: result.rows[0], saved: true });
});

// ---------- Authorization & Roles ----------
router.get('/admin', requireRole('admin'), async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, role, banned, email_verified, created_at FROM users ORDER BY created_at DESC'
  );
  res.render('admin', { users: result.rows, currentUserId: req.session.userId });
});

// Admin: change a user's role
router.post('/admin/users/:id/role', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['user', 'reviewer', 'moderator', 'admin'].includes(role)) {
    return res.status(400).send('Invalid role');
  }
  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
  res.redirect('/admin');
});

// Admin: ban / unban a user
router.post('/admin/users/:id/ban', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { banned } = req.body;
  await pool.query('UPDATE users SET banned = $1 WHERE id = $2', [banned === 'true', id]);
  res.redirect('/admin');
});

module.exports = router;