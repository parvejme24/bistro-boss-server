const AdminConfig = require("../models/AdminConfigModel");

const checkMaintenance = async (req, res, next) => {
  try {
    const config = await AdminConfig.getConfig();
    
    if (config.maintenance.isEnabled) {
      // Check if user's IP is in allowed list
      const clientIP = req.ip || req.connection.remoteAddress;
      const isAllowedIP = config.maintenance.allowedIPs.includes(clientIP);
      
      // Allow admin routes even in maintenance mode
      const isAdminRoute = req.path.startsWith('/api/v1/admin');
      
      if (!isAllowedIP && !isAdminRoute) {
        return res.status(503).json({
          message: "Service temporarily unavailable",
          maintenance: {
            isEnabled: true,
            message: config.maintenance.message,
            estimatedTime: "We'll be back soon",
          },
        });
      }
    }
    
    next();
  } catch (error) {
    // If maintenance check fails, continue normally
    next();
  }
};

module.exports = { checkMaintenance }; 