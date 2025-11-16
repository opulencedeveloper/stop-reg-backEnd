#!/bin/bash

# Deployment script for StopReg Backend
# Usage: ./deploy.sh

SERVER_IP="137.184.93.111"
SERVER_USER="root"
SERVER_PATH="/root/stop-reg-back-end"

echo "🚀 Starting deployment to ${SERVER_USER}@${SERVER_IP}..."

# Build TypeScript locally
echo "🔨 Building TypeScript locally..."
npm run build

# Create deployment package (exclude node_modules, .git, etc.)
echo "📦 Creating deployment package..."
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.env' \
    --exclude='.DS_Store' \
    --exclude='deploy.tar.gz' \
    -czf deploy.tar.gz .

# Upload to server
echo "📤 Uploading to server..."
scp deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/root/

# Deploy on the server
echo "🔧 Deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
  mkdir -p /root/stop-reg-back-end
  cd /root/stop-reg-back-end

  echo "🧹 Cleaning old dist folder..."
  rm -rf dist

  echo "📦 Extracting deployment package..."
  tar -xzf /root/deploy.tar.gz

  echo "📦 Installing production dependencies only..."
  npm install --omit=dev --ignore-scripts

  echo "▶️ Starting backend with PM2..."
  if [ -f "ecosystem.config.js" ]; then
    pm2 restart stop-reg-backend || pm2 start ecosystem.config.js
  else
    pm2 restart stop-reg-backend || pm2 start dist/app.js --name stop-reg-backend
  fi

  pm2 save

  echo "🧹 Cleaning up..."
  rm /root/deploy.tar.gz

  echo "✅ Deployment complete on server!"
ENDSSH

# Clean local deploy file
rm deploy.tar.gz
echo "🎉 Deployment finished!"
