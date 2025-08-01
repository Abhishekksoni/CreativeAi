# 🚀 Production Deployment Guide

This guide provides comprehensive instructions for deploying your blog website to production with professional-grade configuration.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Quick Start](#quick-start)
- [Manual Deployment](#manual-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or later
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB minimum (SSD recommended)
- **CPU**: 2 cores minimum
- **Network**: Static IP address

### Required Software
- Docker & Docker Compose
- Nginx
- Git
- SSL Certificate (Let's Encrypt recommended)

### Required Accounts & Services
- Domain name
- AWS S3 bucket (for image uploads)
- Google OAuth credentials
- GitHub repository

## 🎯 Deployment Options

### Option 1: Automated Script Deployment (Recommended)
```bash
# Clone repository
git clone <your-repo-url>
cd your-blog-project

# Run production setup
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh

# Configure environment variables
cp .env.example .env
nano .env

# Deploy
./deploy.sh
```

### Option 2: Docker Compose Deployment
```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps
```

### Option 3: CI/CD with GitHub Actions
Set up automatic deployment on code push (see [CI/CD Configuration](#cicd-configuration))

## 🚀 Quick Start

### 1. Server Setup
Run the automated setup script on your production server:
```bash
wget https://raw.githubusercontent.com/your-username/your-repo/main/scripts/setup-production.sh
chmod +x setup-production.sh
./setup-production.sh
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Required environment variables:
```env
# Database
DB_PASSWORD=your_secure_password

# Authentication
JWT_SECRET=your_jwt_secret_32_chars_min
SESSION_SECRET=your_session_secret_32_chars_min

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name

# Application
FRONTEND_URL=https://yourdomain.com
```

### 3. Deploy Application
```bash
./deploy.sh
```

### 4. Configure SSL
```bash
sudo certbot --nginx -d yourdomain.com
```

## 📖 Manual Deployment

### Step 1: Server Preparation

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Docker
```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Configure Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Step 2: Application Setup

#### Clone Repository
```bash
git clone <your-repository-url>
cd your-blog-project
```

#### Configure Environment
```bash
cp .env.example .env
nano .env
```

#### Build and Deploy
```bash
docker-compose build
docker-compose up -d
```

### Step 3: Nginx Configuration

#### Install Nginx
```bash
sudo apt install nginx
```

#### Configure Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/blog
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy to frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ☁️ Cloud Deployment

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
- **Instance Type**: t3.medium or larger
- **AMI**: Ubuntu 20.04 LTS
- **Storage**: 20GB GP3 SSD
- **Security Group**: Allow ports 22, 80, 443

#### 2. Configure Domain
- Point your domain to the EC2 public IP
- Set up Route 53 hosted zone (optional)

#### 3. Deploy Application
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Run setup script
wget https://raw.githubusercontent.com/your-username/your-repo/main/scripts/setup-production.sh
chmod +x setup-production.sh
./setup-production.sh
```

### DigitalOcean Droplet

#### 1. Create Droplet
```bash
# Use DigitalOcean's Docker marketplace image
# Or use Ubuntu 20.04 and install Docker manually
```

#### 2. Configure DNS
```bash
# Point your domain to the droplet IP
# Configure DigitalOcean DNS if using their nameservers
```

### Google Cloud Platform

#### 1. Create Compute Engine Instance
```bash
gcloud compute instances create blog-server \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --machine-type=e2-medium \
    --boot-disk-size=20GB \
    --tags=http-server,https-server
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# ======================
# DATABASE CONFIGURATION
# ======================
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_HOST=postgres
DB_PORT=5432

# ======================
# JWT & SESSION SECRETS
# ======================
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
SESSION_SECRET=your_session_secret_key_at_least_32_characters_long

# ======================
# GOOGLE OAUTH
# ======================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ======================
# AWS S3 CONFIGURATION
# ======================
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-blog-bucket-name

# ======================
# APPLICATION SETTINGS
# ======================
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### Generating Secrets

#### JWT and Session Secrets
```bash
# Generate secure secrets
openssl rand -base64 32
```

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://yourdomain.com/auth/google/callback`

#### AWS S3 Setup
1. Create S3 bucket in AWS Console
2. Configure bucket policy for public read access
3. Create IAM user with S3 permissions
4. Generate access key and secret

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Recommended)

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

#### Generate Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Check auto-renewal cron job
sudo crontab -l
```

### Custom SSL Certificate

If using a custom SSL certificate:
```bash
# Copy certificate files
sudo mkdir -p /etc/nginx/ssl
sudo cp your-cert.pem /etc/nginx/ssl/
sudo cp your-private-key.pem /etc/nginx/ssl/

# Update Nginx configuration
ssl_certificate /etc/nginx/ssl/your-cert.pem;
ssl_certificate_key /etc/nginx/ssl/your-private-key.pem;
```

## 📊 Monitoring & Maintenance

### Health Checks

#### Application Health
```bash
# Check backend health
curl https://yourdomain.com/api/health

# Check frontend health
curl https://yourdomain.com/health
```

#### Container Status
```bash
docker-compose ps
docker-compose logs --tail=50
```

### Automated Monitoring

The setup script creates monitoring scripts:

#### Monitor Script (`/home/user/blog-deployment/scripts/monitor.sh`)
- Checks container status
- Monitors disk usage
- Monitors memory usage
- Runs every 5 minutes via cron

#### Backup Script (`/home/user/blog-deployment/scripts/backup.sh`)
- Database backups
- File backups
- Cleanup old backups
- Runs daily at 2 AM

### Log Management

#### View Logs
```bash
# Application logs
docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u docker -f
```

#### Log Rotation
Automatic log rotation is configured for:
- Docker container logs
- Nginx logs
- Application logs

## 🔧 Maintenance Tasks

### Regular Updates

#### Update Application
```bash
# Pull latest changes
git pull origin main

# Redeploy
./deploy.sh
```

#### Update System
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### Database Maintenance

#### Manual Backup
```bash
docker exec blog_postgres pg_dump -U postgres blog_db > backup.sql
```

#### Restore Database
```bash
docker exec -i blog_postgres psql -U postgres blog_db < backup.sql
```

### Performance Optimization

#### Enable Nginx Caching
Add to Nginx configuration:
```nginx
# Cache configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                 inactive=60m use_temp_path=off;

location / {
    proxy_cache my_cache;
    proxy_cache_revalidate on;
    proxy_cache_min_uses 3;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_cache_lock on;
    # ... rest of proxy configuration
}
```

## 🛠️ CI/CD Configuration

### GitHub Actions Setup

#### Required Secrets
Add these secrets to your GitHub repository:

```
PRODUCTION_HOST=your-server-ip
PRODUCTION_USER=ubuntu
PRODUCTION_SSH_KEY=your-private-ssh-key
PRODUCTION_URL=https://yourdomain.com
PRODUCTION_API_URL=https://yourdomain.com/api

# Environment variables
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-s3-bucket
```

#### Workflow Features
- Automated testing on pull requests
- Build and push Docker images
- Deploy to production on main branch push
- Health checks after deployment
- Rollback on failure

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Stop conflicting services
sudo systemctl stop apache2  # if Apache is running
```

#### Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check Nginx configuration
sudo nginx -t
```

#### Database Connection Issues
```bash
# Check database container
docker-compose logs postgres

# Connect to database
docker exec -it blog_postgres psql -U postgres -d blog_db
```

#### Out of Disk Space
```bash
# Clean Docker images
docker system prune -a

# Check disk usage
df -h
du -sh /*
```

### Health Check Commands

```bash
# Quick health check
curl -f https://yourdomain.com/health
curl -f https://yourdomain.com/api/health

# Comprehensive system check
./scripts/monitor.sh

# Check all services
docker-compose ps
systemctl status nginx
systemctl status docker
```

### Performance Debugging

#### Database Performance
```bash
# Check database connections
docker exec blog_postgres psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Analyze slow queries
docker exec blog_postgres psql -U postgres -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

#### Memory Usage
```bash
# Check container memory usage
docker stats

# System memory
free -h
top
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify environment variables: `cat .env`
3. Test connectivity: `curl -f https://yourdomain.com/health`
4. Check system resources: `top`, `df -h`
5. Review this troubleshooting guide

For additional support, please check the repository issues or create a new issue with:
- Error messages
- System information
- Steps to reproduce
- Log outputs

---

## 🎉 Congratulations!

Your blog website is now deployed with production-level configuration including:

- ✅ Containerized application with Docker
- ✅ Reverse proxy with Nginx
- ✅ SSL/HTTPS encryption
- ✅ Automated deployments
- ✅ Health monitoring
- ✅ Automated backups
- ✅ Security hardening
- ✅ Performance optimization

Your blog is ready to handle production traffic! 🚀