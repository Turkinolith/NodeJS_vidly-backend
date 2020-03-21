module.exports = function(req, res, next) {
  // 401 - Unauthorized - When try to access protected resource but doesn't supply valid JWT
  // 403 - Forbidden - Valid JWT but not allowed.
  //* If user is NOT an admin, reject forbidden.
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  //* If user is an admin, pass control to next function in the pipeline.
  next();
};
