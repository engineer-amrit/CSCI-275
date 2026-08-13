# Restaurant Review App: User Management & Authentication

A complete user account system covering registration, login, password
recovery, profile management, email verification, and role-based access
control for the restaurant review platform.

## User classes
| Class | How it's assigned |
|---|---|
| Guest | Anyone not logged in, can browse without an account |
| Registered User | Default role, assigned automatically on signup |
| Reviewer | Assigned by an admin via the admin dashboard |
| Moderator | Assigned by an admin via the admin dashboard |
| Admin | Full access, can assign roles and ban accounts |

## Features
1. **Registration & Onboarding** : full name, email, password, optional
   profile photo (upload + crop), Terms of Service checkbox
2. **Email Verification** : simulated verification email with a 24-hour
   token link, a "check your inbox" confirmation page, a verified/welcome
   landing page, an expired-link page, and a resend option
3. **Authentication & Sessions** : login/logout, sessions persisted in
   PostgreSQL, banned accounts blocked at login
4. **Password Management** : forgot password (email only) and reset
   password (new password + confirm, accessed via a time-limited link)
5. **User Profile** : name, bio, location, profile photo with client-side
   crop/zoom (no external library — plain canvas)
6. **Authorization & Roles** : admin dashboard listing all users with a
   role dropdown (Registered User / Reviewer / Moderator / Admin) and a
   ban/unban toggle per account

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

## Setup (run these in order)

```bash
# 1. Install dependencies
npm install

# 2. Create the database (run once)
createdb restaurant_reviews
# If that command isn't found, open psql and run: CREATE DATABASE restaurant_reviews;

# 3. Copy env file and edit it with your Postgres username/password
cp .env.example .env
# open .env and set DATABASE_URL to match your local Postgres

# 4. Create tables + seed a demo admin account
npm run initdb

# 5. Start the server
npm start
```

Then open **http://localhost:3000**

## Demo login
- Admin account (pre-seeded): `admin@demo.com` / `admin123`
- Or click "Register" to create a normal user account live during your demo.

## JSON API (for the moderation service)

All JSON routes are mounted under `/json` and use the same PostgreSQL-backed
sessions as the web UI (no JWTs). Authenticate by calling `/json/login` to get
a `sessionToken` (the server-side session id), then send it on every request
via the `x-session-token` header or `Authorization: Bearer <token>`.

A **root moderator** is bootstrapped automatically on server start from these
env vars (add them to `.env`):
`ROOT_MODERATOR_NAME`, `ROOT_MODERATOR_EMAIL`, `ROOT_MODERATOR_PASSWORD`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/json/login` | none | `{email, password}` → `{sessionToken, user}` |
| POST | `/json/logout` | token | Destroys the session |
| POST | `/json/verify` | token or `{token}` | `{valid, user}` — validates a session token |
| GET | `/json/me` | moderator | Returns the authenticated user |
| POST | `/json/users` | moderator | `{name, email, password}` → creates a moderator (409 on duplicate email) |
| GET | `/json/users` | moderator | Lists all moderator users |
| GET | `/json/users/:id` | moderator | Returns a single user (404 if not found) |

Example flow for the moderation service:

```bash
# 1. Login as the root moderator to get a session token
TOKEN=$(curl -s -X POST http://localhost:3000/json/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"moderator@admin.com","password":"moderator123"}' \
  | jq -r .sessionToken)

# 2. Verify a token on every request
curl -s -X POST http://localhost:3000/json/verify \
  -H 'Content-Type: application/json' -H "x-session-token: $TOKEN" \
  -d '{}'

# 3. Create more moderators
curl -s -X POST http://localhost:3000/json/users \
  -H 'Content-Type: application/json' -H "x-session-token: $TOKEN" \
  -d '{"name":"Moderator Two","email":"mod2@example.com","password":"secret123"}'
```

## Demo walkthrough


1. Visit **http://localhost:3000** logged out → shows the Guest home page
2. **Register** a new account, including a profile photo (crop it) and
   accepting the ToS checkbox → shows Registration & Onboarding
3. Land on "Check your inbox" → click the simulated verification link →
   shows Email Verification
4. **Log out**, then **log back in** → shows Authentication & Sessions
5. Click **"Forgot password"**, submit your email → shows Password
   Management (reset link is displayed on screen instead of emailed,
   for demo purposes)
6. Go to **Profile**, edit your bio/location, save → shows User Profile
7. Log out, log in as `admin@demo.com` / `admin123`, visit **/admin** →
   shows Authorization & Roles: change a user's role dropdown, ban/unban
   an account (regular users get a 403 if they try to visit `/admin`
   directly)

## Project structure
```
server.js                      - app entrypoint, session setup, home route
db/schema.sql                   - users + session tables
db/init.js                      - creates tables, seeds admin
db/bootstrap.js                 - creates the root moderator from env on start
routes/auth.js                  - register, login, logout, email verification
routes/password.js              - forgot/reset password
routes/profile.js               - profile view/edit, admin dashboard, role/ban actions
routes/json.js                  - JSON API for the moderation service (session tokens)
middleware/auth.js              - requireLogin, requireRole
public/js/avatar-crop.js        - client-side photo upload + crop widget
views/*.ejs                      - all pages
```

## If something breaks:
- `npm run initdb` is safe to re-run (it checks before inserting the admin).
- If PostgreSQL connection fails, double check `DATABASE_URL` in `.env`
  matches your actual Postgres username/password/port.
- If you change `db/schema.sql`, you must drop and recreate the database
  before re-running `npm run initdb`, or new columns won't exist:
  ```bash
  dropdb restaurant_reviews
  createdb restaurant_reviews
  npm run initdb
  ```
