/**
 * Role-Based Access Control (RBAC) Middleware
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-F-003, IPR-SR-003, TC-Auth-03
 */

/**
 * Middleware factory for Role-Based Access Control.
 * Restricts access to endpoints based on user roles: 'student', 'recruiter', 'admin'.
 * 
 * @param {...string} allowedRoles - Array of roles permitted to access the resource
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required.',
        statusCode: 401
      });
    }

    const userRole = req.user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted. Role '${req.user.role}' is not authorized to access this resource.`,
        statusCode: 403,
        requiredRoles: allowedRoles
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};
