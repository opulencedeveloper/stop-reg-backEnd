#!/bin/bash

# Deployment script for StopReg Backend
# Usage: ./deploy.sh

SERVER_IP="137.184.93.111"
SERVER_USER="Stop_ReGzFresh3Log"
SERVER_PATH="/home/${SERVER_USER}/stop-reg-back-end"
LOCAL_PATH="."

echo "🚀 Starting deployment to ${SERVER_USER}@${SERVER_IP}..."

# Build the project
echo "📦 Building TypeScript..."
npm run build

# Create deployment package (exclude node_modules, .git, etc.)
echo "📦 Creating deployment package..."
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.env' \
    --exclude='dist' \
    --exclude='.DS_Store' \
    -czf deploy.tar.gz .

# Upload to server
echo "📤 Uploading to server..."
scp deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:~/

# SSH and deploy
echo "🔧 Deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
  # Create directory if it doesn't exist
  mkdir -p ~/stop-reg-back-end
  cd ~/stop-reg-back-end
  
  # Extract files
  tar -xzf ~/deploy.tar.gz
  
  # Install dependencies
  npm install --production
  
  # Build TypeScript
  npm run build
  
  # Restart PM2 (if using PM2)
  pm2 restart stop-reg-backend || pm2 start ecosystem.config.js
  
  # Clean up
  rm ~/deploy.tar.gz
  
  echo "✅ Deployment complete!"
ENDSSH

# Clean up local files
rm deploy.tar.gz

echo "🎉 Deployment finished!"

