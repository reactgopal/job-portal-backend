const ApiError = require('../utils/ApiError');

/**
 * Factory function — returns middleware that checks if user has one of the allowed roles.
 * @param  {...string} roles  e.g. 'admin', 'company'
 */
const roleMiddleware = (...roles) => (req, _res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user.role}' is not authorized to access this resource`);
  }
  next();
};

module.exports = roleMiddleware;
