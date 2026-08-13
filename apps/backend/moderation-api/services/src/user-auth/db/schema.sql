-- ===================================================
-- User Management & Authentication schema
-- Covers: Registration, Auth, Passwords, Profile, Roles,
--         Email Verification, Admin Bans, Linked Accounts
-- ===================================================

CREATE TABLE IF NOT EXISTS users (
    id                    SERIAL PRIMARY KEY,
    name                  VARCHAR(100) NOT NULL,
    email                 VARCHAR(255) UNIQUE NOT NULL,
    password_hash         TEXT NOT NULL,
    bio                   TEXT DEFAULT '',
    avatar_url            TEXT DEFAULT '',
    location              VARCHAR(150) DEFAULT '',
    linked_accounts       TEXT DEFAULT '',
    role                  VARCHAR(20) NOT NULL DEFAULT 'user',
    is_root               BOOLEAN NOT NULL DEFAULT FALSE,
    banned                BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified        BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token     TEXT,
    verification_token_expires TIMESTAMP,
    reset_token           TEXT,
    reset_token_expires    TIMESTAMP,
    created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
    "sid"    VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
    "sess"   JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- If you already ran the OLD schema before and have real data you want to keep,
-- run this instead of CREATE TABLE to just add the new columns:
--
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(150) DEFAULT '';
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS linked_accounts TEXT DEFAULT '';
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN NOT NULL DEFAULT FALSE;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS is_root BOOLEAN NOT NULL DEFAULT FALSE;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;
