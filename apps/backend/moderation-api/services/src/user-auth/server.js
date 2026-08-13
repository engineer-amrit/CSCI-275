require('dotenv').config()
const express = require('express')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pool = require('./db/pool')
const { ensureRootModerator } = require('./db/bootstrap')

const authRoutes = require('./routes/auth')
const passwordRoutes = require('./routes/password')
const profileRoutes = require('./routes/profile')
const jsonRoutes = require('./routes/json')

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use(
  session({
    store: new pgSession({ pool, tableName: 'session' }),
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  }),
)

// Make login state available to every view (for nav bar etc.)
app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.userId
  res.locals.role = req.session.role || null
  next()
})

app.get('/', (req, res) => res.render('home'))

app.use(authRoutes)
app.use(passwordRoutes)
app.use(profileRoutes)

// JSON API for the moderation service (session-token based)
app.use('/json', jsonRoutes)

// Bootstrap the root moderator (from env), then start listening.
// If the DB is down at startup we log the error but still start the server.
ensureRootModerator()
  .catch((err) =>
    console.error('❌ Root moderator bootstrap failed:', err.message),
  )
  .finally(() => {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`),
    )
  })
