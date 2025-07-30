const pino = require('pino');

// Create logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Request logging middleware
function requestLogger(request, reply, next) {
  const startTime = Date.now();
  
  reply.addHook('onResponse', (request, reply, done) => {
    const duration = Date.now() - startTime;
    
    logger.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      userAgent: request.headers['user-agent'],
      ip: request.ip
    });
    
    done();
  });
  
  next();
}

// Error logging middleware
function errorLogger(error, request, reply) {
  logger.error({
    error: error.message,
    stack: error.stack,
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    userAgent: request.headers['user-agent'],
    ip: request.ip
  });
}

module.exports = {
  logger,
  requestLogger,
  errorLogger
}; 