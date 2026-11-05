/**
 * Health Diagnostics & System Telemetry Controller (Sprint-2)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-NF-002, TC-Rel-01 (Availability & Graceful Monitoring)
 */

const os = require('os');

const getSystemHealth = (req, res) => {
  const memoryUsage = process.memoryUsage();

  const healthData = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'Online Internship & Placement Preparation Portal',
    version: '2.0.0 (Sprint-2 Final Freeze)',
    environment: process.env.NODE_ENV || 'development',
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cpuCount: os.cpus().length,
      freeMemoryMB: Math.round(os.freemem() / (1024 * 1024)),
      totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024))
    },
    processMemory: {
      rssMB: Math.round(memoryUsage.rss / (1024 * 1024)),
      heapTotalMB: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
      heapUsedMB: Math.round(memoryUsage.heapUsed / (1024 * 1024))
    },
    subsystems: {
      authentication: { status: 'OPERATIONAL', engine: 'JWT + bcrypt (10 rounds)' },
      rateLimiter: { status: 'ACTIVE', algorithm: 'Sliding Window' },
      sanitization: { status: 'ACTIVE', rule: 'Recursive XSS Strip' },
      securityHeaders: { status: 'ENFORCED', standard: 'OWASP Top 10' }
    }
  };

  return res.status(200).json({
    success: true,
    data: healthData
  });
};

module.exports = {
  getSystemHealth
};
