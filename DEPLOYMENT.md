# Deployment Guide

## Prerequisites

1. **SSH Access** to the server
2. **Node.js** installed on the server (v18+ recommended)
3. **PM2** installed globally on the server: `npm install -g pm2`
4. **Environment Variables** set on the server

## Server Setup (First Time Only)

SSH into your server and run:

```bash
ssh Stop_ReGzFresh3Log@137.184.93.111

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create project directory
mkdir -p ~/stop-reg-back-end
cd ~/stop-reg-back-end
```

## Environment Variables

Create a `.env` file on the server with:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
CORS_ORIGIN=http://127.0.0.1:5500,https://your-frontend-domain.com
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAILFROM=noreply@stopreg.com
FRONTEND_URL=https://your-frontend-url.com
# ... other environment variables
```

## Deployment Methods

### Method 1: Using Deployment Script (Recommended)

1. **Make script executable** (if not already):
   ```bash
   chmod +x deploy.sh
   ```

2. **Run deployment**:
   ```bash
   ./deploy.sh
   ```

   You'll be prompted for your SSH password.

### Method 2: Manual Deployment

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload files** (excluding node_modules):
   ```bash
   rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
     ./ Stop_ReGzFresh3Log@137.184.93.111:~/stop-reg-back-end/
   ```

3. **SSH into server**:
   ```bash
   ssh Stop_ReGzFresh3Log@137.184.93.111
   cd ~/stop-reg-back-end
   ```

4. **Install dependencies and build**:
   ```bash
   npm install --production
   npm run build
   ```

5. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup  # Run this once to auto-start on server reboot
   ```

### Method 3: Using Git (Recommended for Production)

1. **Push to Git repository** (GitHub, GitLab, etc.)

2. **On server, clone and setup**:
   ```bash
   ssh Stop_ReGzFresh3Log@137.184.93.111
   cd ~/stop-reg-back-end
   git pull origin main
   npm install --production
   npm run build
   pm2 restart stop-reg-backend
   ```

## PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js

# Restart application
pm2 restart stop-reg-backend

# Stop application
pm2 stop stop-reg-backend

# View logs
pm2 logs stop-reg-backend

# Monitor
pm2 monit

# Save current process list
pm2 save

# Auto-start on reboot
pm2 startup
```

## Troubleshooting

1. **Check if app is running**:
   ```bash
   pm2 list
   ```

2. **View logs**:
   ```bash
   pm2 logs stop-reg-backend
   ```

3. **Check port**:
   ```bash
   netstat -tulpn | grep 8080
   ```

4. **Restart if needed**:
   ```bash
   pm2 restart stop-reg-backend
   ```

## Security Notes

- Never commit `.env` file to Git
- Use SSH keys instead of passwords when possible
- Keep dependencies updated
- Use firewall to restrict access to port 8080 if needed

