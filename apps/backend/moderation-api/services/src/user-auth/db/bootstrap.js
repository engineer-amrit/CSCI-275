// Creates the root moderator on server start so the moderation service
// always has known credentials to bootstrap from (see .env.example).
const bcrypt = require('bcrypt');
const pool = require('./pool');

async function ensureRootModerator() {
  const email = process.env.ROOT_MODERATOR_EMAIL;
  const password = process.env.ROOT_MODERATOR_PASSWORD;
  const name = process.env.ROOT_MODERATOR_NAME || 'Root Moderator';

  if (!email || !password) {
    console.warn(
      '⚠️  ROOT_MODERATOR_EMAIL / ROOT_MODERATOR_PASSWORD not set — skipping root moderator bootstrap.'
    );
    return;
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    console.log(`ℹ️  Root moderator already exists (${email}), skipping.`);
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role, is_root, email_verified)
     VALUES ($1, $2, $3, 'moderator', TRUE, TRUE)`,
    [name, email, hash]
  );
  console.log(`✅ Root moderator created -> email: ${email}`);
}

module.exports = { ensureRootModerator };
