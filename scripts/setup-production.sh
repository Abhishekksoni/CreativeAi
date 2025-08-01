#!/bin/bash

# Production Server Setup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${GREEN}🚀 Setting up Production Server for Blog Website${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    nginx \
    certbot \
    python3-certbot-nginx

# Install Docker
print_status "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose (standalone)
print_status "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure firewall
print_status "Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
echo "y" | sudo ufw enable

# Configure fail2ban
print_status "Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create deployment directory
DEPLOY_DIR="/home/$USER/blog-deployment"
print_status "Creating deployment directory at $DEPLOY_DIR..."
mkdir -p $DEPLOY_DIR

# Configure Nginx (basic configuration)
print_status "Configuring Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default

# Create Nginx configuration for the blog
sudo tee /etc/nginx/sites-available/blog > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    # Redirect all HTTP traffic to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name _;
    
    # SSL configuration (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy to Docker containers
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Set up log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/blog > /dev/null <<EOF
/var/log/blog/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        systemctl reload docker
    endscript
}
EOF

# Create monitoring script
print_status "Creating monitoring script..."
mkdir -p $DEPLOY_DIR/scripts
tee $DEPLOY_DIR/scripts/monitor.sh > /dev/null <<'EOF'
#!/bin/bash

# Simple monitoring script
LOGFILE="/var/log/blog/monitor.log"
mkdir -p $(dirname $LOGFILE)

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "$(date): Some containers are down. Attempting restart..." >> $LOGFILE
    docker-compose restart
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    echo "$(date): High disk usage: ${DISK_USAGE}%" >> $LOGFILE
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ $MEM_USAGE -gt 85 ]; then
    echo "$(date): High memory usage: ${MEM_USAGE}%" >> $LOGFILE
fi
EOF

chmod +x $DEPLOY_DIR/scripts/monitor.sh

# Add monitoring to crontab
print_status "Adding monitoring to crontab..."
(crontab -l 2>/dev/null; echo "*/5 * * * * $DEPLOY_DIR/scripts/monitor.sh") | crontab -

# Create backup script
print_status "Creating backup script..."
tee $DEPLOY_DIR/scripts/backup.sh > /dev/null <<'EOF'
#!/bin/bash

BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker exec blog_postgres pg_dump -U postgres blog_db > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploaded files (if any)
if [ -d "/var/lib/docker/volumes/blog_uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C /var/lib/docker/volumes/ blog_uploads
fi

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date): Backup completed" >> /var/log/blog/backup.log
EOF

chmod +x $DEPLOY_DIR/scripts/backup.sh

# Add backup to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * $DEPLOY_DIR/scripts/backup.sh") | crontab -

print_status "Production server setup completed! ✅"
print_warning "Please complete the following steps manually:"
echo "1. Configure your domain DNS to point to this server"
echo "2. Run: sudo certbot --nginx -d yourdomain.com"
echo "3. Update the Nginx configuration with your actual domain"
echo "4. Clone your blog repository to $DEPLOY_DIR"
echo "5. Configure environment variables in $DEPLOY_DIR/.env"
echo "6. Run the deployment script: $DEPLOY_DIR/deploy.sh"

print_status "Rebooting in 10 seconds to apply all changes..."
sleep 10
sudo reboot