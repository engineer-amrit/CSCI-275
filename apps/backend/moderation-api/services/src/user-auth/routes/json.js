// JSON API for the moderation service.
//
// Uses the SAME session mechanism as the rest of the app (express-session +
// connect-pg-simple, stored in Postgres). The moderation service authenticates
// by logging in via /json/login to obtain a session token, then sends it on
// every request via the `x-session-token` header (or `Authorization: Bearer <token>`).
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const router = express.Router();

// ---------- Helpers ----------

function tokenFromRequest(req) {
  const header = req.headers['x-session-token'];
  if (header) return header;
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

async function loadSession(sid) {
  if (!sid) return null;
  const result = await pool.query(
    'SELECT sess FROM "session" WHERE sid = $1 AND expire > NOW()',
    [sid]
  );
  const row = result.rows[0];
  if (!row) return null;
  // The `sess` column is a JSON type, which node-postgres already parses to an
  // object; fall back to parsing if it ever comes back as a string.
  return typeof row.sess === 'string' ? JSON.parse(row.sess) : row.sess;
}

async function userFromSid(sid) {
  const sess = await loadSession(sid);
  if (!sess || !sess.userId) return null;
  const result = await pool.query(
    'SELECT id, name, email, role, is_root FROM users WHERE id = $1 AND banned = FALSE',
    [sess.userId]
  );
  return result.rows[0] || null;
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isRoot: user.is_root,
  };
}

async function requireModerator(req, res, next) {
  try {
    const user = await userFromSid(tokenFromRequest(req));
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }
    if (user.role !== 'moderator') {
      return res.status(403).json({ error: 'Moderator role required' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// ---------- Auth ----------

// POST /json/login  { email, password } -> { sessionToken, user }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.banned) {
      return res.status(403).json({ error: 'This account has been suspended' });
    }

    req.session.userId = user.id;
    req.session.role = user.role;
    await new Promise((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve()))
    );

    res.json({ sessionToken: req.session.id, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /json/logout  -> destroy the session
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// ---------- Verification (used by the moderation service) ----------

// POST /json/verify  { token } or `x-session-token` / Bearer header
// -> { valid: true, user } or 401 { valid: false, error }
router.post('/verify', async (req, res) => {
  try {
    const sid = tokenFromRequest(req) || (req.body && req.body.token);
    const user = await userFromSid(sid);
    if (!user) {
      return res.status(401).json({ valid: false, error: 'Invalid or expired session token' });
    }
    res.json({ valid: true, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, error: 'Something went wrong' });
  }
});

// GET /json/me  (requires moderator session)
router.get('/me', requireModerator, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// ---------- Moderator management ----------

// POST /json/users  { name, email, password }  (requires moderator session)
// Creates another moderator so the moderation service can scale its staff.
router.post('/users', requireModerator, async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A user with that email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, email_verified)
       VALUES ($1, $2, $3, 'moderator', TRUE)
       RETURNING id, name, email, role, is_root`,
      [name, email, hash]
    );

    res.status(201).json({ user: publicUser(result.rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /json/users  (requires moderator session) — list moderators
router.get('/users', requireModerator, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_root, banned FROM users WHERE role = $1 ORDER BY id',
      ['moderator']
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /json/users/:id  (requires moderator session) — fetch a single user
router.get('/users/:id', requireModerator, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_root, banned FROM users WHERE id = $1',
      [id]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
