// --- Authentication & Sessions + Authorization & Roles ---

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/login');
    }
    if (req.session.role !== role) {
      return res.status(403).render('error', {
        message: `Access denied — this page requires the "${role}" role.`,
      });
    }
    next();
  };
}

module.exports = { requireLogin, requireRole };
