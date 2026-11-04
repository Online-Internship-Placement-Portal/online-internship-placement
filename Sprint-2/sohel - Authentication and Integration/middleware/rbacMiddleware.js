/**
 * Role-Based Access Control (RBAC) Middleware (Sprint-2)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-F-003, IPR-SR-003, TC-Auth-03, TC-Sec-03, SAD Section 3.9
 */

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized. Authentication identity required.'
      });
    }

    const userRole = req.user.role.toLowerCase();
    const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Forbidden: Access denied. Required role: [${allowedRoles.join(', ')}]. Current role: [${req.user.role}].`
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};
