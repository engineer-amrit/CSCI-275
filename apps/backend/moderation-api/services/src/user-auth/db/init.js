// Runs schema.sql against the database and seeds one admin user
// so the Authorization & Roles part has something to demo immediately.
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('./pool');

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('✅ Schema created (users + session tables).');

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@demo.com']);
  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, email_verified) VALUES ($1, $2, $3, $4, $5)`,
      ['Demo Admin', 'admin@demo.com', hash, 'admin', true]
    );
    console.log('✅ Seeded admin account -> email: admin@demo.com / password: admin123');
  } else {
    console.log('ℹ️  Admin account already exists, skipping seed.');
  }

  await pool.end();
}

init().catch((err) => {
  console.error('❌ DB init failed:', err.message);
  process.exit(1);
});
