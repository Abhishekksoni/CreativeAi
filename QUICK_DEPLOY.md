# 🚀 Quick Deploy Reference

## Prerequisites Checklist
- [ ] Ubuntu 20.04+ server with SSH access
- [ ] Domain name pointing to server IP
- [ ] Google OAuth credentials
- [ ] AWS S3 bucket setup

## 1-Minute Deploy (Automated)

```bash
# Clone repository
git clone <your-repo-url>
cd your-blog-project

# Setup production server
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh

# Configure environment
cp .env.example .env
nano .env  # Fill in your values

# Deploy application
./deploy.sh

# Configure SSL
sudo certbot --nginx -d yourdomain.com
```

## Essential Environment Variables

```env
# Database
DB_PASSWORD=your_secure_password_here

# Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_key_32_chars_min
SESSION_SECRET=your_session_secret_key_32_chars_min

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-blog-bucket-name

# URLs
FRONTEND_URL=https://yourdomain.com
```

## Quick Commands

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Update application
git pull && ./deploy.sh

# Health check
curl https://yourdomain.com/health
curl https://yourdomain.com/api/health

# Backup database
docker exec blog_postgres pg_dump -U postgres blog_db > backup.sql
```

## Troubleshooting

```bash
# Restart services
docker-compose restart

# Check Nginx
sudo nginx -t
sudo systemctl reload nginx

# View detailed logs
docker-compose logs backend
docker-compose logs frontend
sudo tail -f /var/log/nginx/error.log
```

**Need help?** See the complete [DEPLOYMENT.md](./DEPLOYMENT.md) guide.