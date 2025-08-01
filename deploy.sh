#!/bin/bash

# Production Deployment Script for Blog Website
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Production Deployment${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found! Please create one from .env.example"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "SESSION_SECRET" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_status "Environment variables validated ✅"

# Create backup of current deployment (if exists)
if [ "$(docker-compose ps -q)" ]; then
    print_status "Creating backup of current deployment..."
    docker-compose down
    docker tag blog_backend:latest blog_backend:backup || true
    docker tag blog_frontend:latest blog_frontend:backup || true
fi

# Pull latest changes from git (optional)
if [ "$1" = "--git-pull" ]; then
    print_status "Pulling latest changes from git..."
    git pull origin main
fi

# Build and deploy with Docker Compose
print_status "Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
timeout=120
counter=0

while [ $counter -lt $timeout ]; do
    if docker-compose ps | grep -q "healthy"; then
        print_status "Services are healthy! ✅"
        break
    fi
    
    if [ $counter -eq $timeout ]; then
        print_error "Services failed to become healthy within $timeout seconds"
        print_warning "Rolling back to previous version..."
        docker-compose down
        docker tag blog_backend:backup blog_backend:latest || true
        docker tag blog_frontend:backup blog_frontend:latest || true
        docker-compose up -d
        exit 1
    fi
    
    echo -n "."
    sleep 5
    counter=$((counter + 5))
done

# Test endpoints
print_status "Testing application endpoints..."

# Test backend health
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    print_status "Backend health check passed ✅"
else
    print_error "Backend health check failed ❌"
fi

# Test frontend
if curl -f http://localhost/health >/dev/null 2>&1; then
    print_status "Frontend health check passed ✅"
else
    print_error "Frontend health check failed ❌"
fi

# Show running services
print_status "Deployment completed! Services status:"
docker-compose ps

print_status "Application is available at:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost:3000"

# Clean up old images
print_status "Cleaning up old Docker images..."
docker image prune -f

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"