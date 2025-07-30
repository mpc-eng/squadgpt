# SquadGPT Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Redis (for caching)
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL certificate

### Environment Variables

Create `.env.production` in the backend:

```env
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@host:5432/squadgpt

# OpenAI
OPENAI_API_KEY=your_production_api_key

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### Backend Deployment

1. **Build the application:**
```bash
cd squadgpt-backend
npm ci --only=production
```

2. **Create PM2 ecosystem file:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'squadgpt-backend',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

3. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Frontend Deployment

1. **Build the application:**
```bash
cd squadgpt-frontend
npm ci
npm run build
```

2. **Deploy to Vercel/Netlify or serve with PM2:**
```bash
# For PM2 deployment
pm2 start npm --name "squadgpt-frontend" -- start
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/squadgpt
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./squadgpt-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/squadgpt
    depends_on:
      - db
      - redis

  frontend:
    build: ./squadgpt-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: squadgpt
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Monitoring & Health Checks

1. **Health Check Endpoint:**
```bash
curl https://yourdomain.com/health
```

2. **PM2 Monitoring:**
```bash
pm2 monit
pm2 logs
```

3. **Database Monitoring:**
```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Backup Strategy

1. **Database Backups:**
```bash
# Daily backup
pg_dump squadgpt > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump squadgpt > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

2. **Application Backups:**
```bash
# Backup application files
tar -czf squadgpt_backup_$(date +%Y%m%d).tar.gz squadgpt/
```

### Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables properly configured
- [ ] Database credentials secured
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Regular security updates
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Log rotation configured

### Performance Optimization

1. **Database Indexing:**
```sql
-- Add indexes for common queries
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_users_email ON users(email);
```

2. **Caching Strategy:**
```javascript
// Redis caching for API responses
const cache = require('redis').createClient();
const CACHE_TTL = 3600; // 1 hour

async function getCachedResponse(key) {
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);
  return null;
}
```

3. **CDN Configuration:**
- Configure Cloudflare or similar CDN
- Enable caching for static assets
- Set up edge locations for global performance

### Troubleshooting

1. **Common Issues:**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs squadgpt-backend

# Restart services
pm2 restart all

# Check disk space
df -h

# Check memory usage
free -h
```

2. **Performance Issues:**
```bash
# Monitor CPU usage
htop

# Check network connections
netstat -tulpn

# Monitor database performance
pg_stat_statements
``` 