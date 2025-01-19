const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res
      .status(403)
      .send({ error: `Zabranjen pristup - vaša uloga je ${req.user.role}` });
  }
};

module.exports = checkRole;
