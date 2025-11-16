# Deployment Guide

## Prerequisites

1. **SSH Access** to the server
2. **Node.js** installed on the server (v18+ recommended)
3. **PM2** installed globally on the server: `npm install -g pm2`
4. **Environment Variables** set on the server

## Server Information

- **Server IP**: 137.184.93.111
- **Username**: root
- **Server Type**: Bare-metal server

## Initial Server Setup (First Time Only)

### Step 1: Connect to Server

```bash
ssh root@137.184.93.111
```

### Step 2: Identify Your Operating System

First, check which operating system your server is running:

```bash
# Check OS type
cat /etc/os-release

# Or for older systems
uname -a
```

### Step 3: Install Node.js

Since Node.js is not installed on the server, you need to install it first. Choose the method based on your server's operating system:

#### For Ubuntu/Debian Systems:

```bash
# Update package index
apt-get update

# Install curl and other prerequisites
apt-get install -y curl build-essential

# Install Node.js 18.x using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### For CentOS/RHEL Systems:

```bash
# Update package index
yum update -y

# Install curl and other prerequisites
yum install -y curl gcc-c++ make

# Install Node.js 18.x using NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Verify installation
node --version
npm --version
```

#### Alternative: Using NVM (Node Version Manager)

If you prefer using NVM for easier Node.js version management:

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version
npm --version
```

### Step 4: Install PM2 Globally

```bash
npm install -g pm2

# Verify PM2 installation
pm2 --version
```

### Step 5: Setup PM2 to Start on System Boot

```bash
# Generate startup script
pm2 startup

# Follow the instructions provided by the command above
# It will output a command that you need to run with sudo
# Example: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### Step 6: Create Project Directory

```bash
mkdir -p ~/stop-reg-back-end
cd ~/stop-reg-back-end
```

## MongoDB Database Setup

This application uses **MongoDB** as its database. You have several options for setting up MongoDB:

### Option 1: MongoDB Atlas (Cloud - Recommended for Production)

MongoDB Atlas is a fully managed cloud database service. This is the **recommended option** for production.

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a cluster** (free tier available)
3. **Create a database user**:
   - Go to Database Access → Add New Database User
   - Choose username and password
   - Save credentials securely
4. **Whitelist your server IP**:
   - Go to Network Access → Add IP Address
   - Add `137.184.93.111` (your server IP)
   - Or use `0.0.0.0/0` for development (not recommended for production)
5. **Get connection string**:
   - Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`

### Option 2: Install MongoDB on the Server

If you prefer to run MongoDB on the same server:

#### For Ubuntu/Debian:

```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Verify installation
systemctl status mongod
```

**Connection string for local MongoDB:**
```
mongodb://localhost:27017/stop-reg-db
```

#### For CentOS/RHEL:

```bash
# Create MongoDB repository file
cat > /etc/yum.repos.d/mongodb-org-7.0.repo <<EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF

# Install MongoDB
yum install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Verify installation
systemctl status mongod
```

**Connection string for local MongoDB:**
```
mongodb://localhost:27017/stop-reg-db
```

### Option 3: Use Existing MongoDB Instance

If you already have a MongoDB instance (local or remote), use its connection string.

**Connection String Format:**
- **Local MongoDB**: `mongodb://localhost:27017/database-name`
- **Remote MongoDB**: `mongodb://username:password@host:port/database-name`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`

### MongoDB Security Best Practices

1. **Use strong passwords** for database users
2. **Restrict network access** - only allow connections from your server IP
3. **Enable authentication** - always require username/password
4. **Use SSL/TLS** - especially for remote connections (MongoDB Atlas uses this by default)
5. **Regular backups** - set up automated backups for production data

## Environment Variables

Create a `.env` file in the project root (`/root/stop-reg-back-end/.env`) with:

```env
# MongoDB Connection (REQUIRED)
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
# For local MongoDB: mongodb://localhost:27017/stop-reg-db
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=8080
NODE_ENV=production

# CORS Configuration
# Comma-separated list of allowed origins (frontend domains)
# Production: https://stopreg.com,https://www.stopreg.com
# Development: http://127.0.0.1:5500,http://localhost:3000
CORS_ORIGIN=https://stopreg.com,https://www.stopreg.com

# Email Configuration (SMTP)
EMAILSENDER=your_smtp_user
EMAILSENDERPASSWORD=your_smtp_password
EMAILFROM=noreply@stopreg.com

# Frontend URL (used in email templates)
# Production: https://stopreg.com
FRONTEND_URL=https://stopreg.com

# Add any other required environment variables
```

**Important Notes:**
- The `MONGODB_URI` is **required** - the application will not start without it
- Never commit the `.env` file to Git
- Keep your MongoDB credentials secure
- For MongoDB Atlas, ensure your server IP (`137.184.93.111`) is whitelisted

## Deployment Methods

### Method 1: Using Deployment Script (Recommended)

This method builds TypeScript locally and deploys only compiled JavaScript to the server. This is the **recommended production approach**.

**Benefits:**
- ✅ No TypeScript or devDependencies needed on server
- ✅ Faster deployments
- ✅ More secure (smaller attack surface)
- ✅ No build errors on server

1. **Make script executable** (if not already):
   ```bash
   chmod +x deploy.sh
   ```

2. **Run deployment**:
   ```bash
   ./deploy.sh
   ```

   The script will:
   - Install dependencies locally
   - Build TypeScript locally
   - Upload compiled code to server
   - Install only production dependencies on server
   - Start/restart the application with PM2

   You'll be prompted for your SSH password.

### Method 2: Manual Deployment

**Important:** Build TypeScript locally, then deploy only compiled JavaScript to the server.

1. **Install dependencies and build locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Upload files** (excluding node_modules, but including dist/):
   ```bash
   rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
     ./ root@137.184.93.111:~/stop-reg-back-end/
   ```

3. **SSH into server**:
   ```bash
   ssh root@137.184.93.111
   cd ~/stop-reg-back-end
   ```

4. **Install production dependencies only** (no build needed):
   ```bash
   npm install --omit=dev
   ```

5. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup  # Run this once to auto-start on server reboot
   ```

### Method 3: Using Git (For Production with CI/CD)

**Note:** This method requires building on the server. For production, prefer Method 1 (build locally).

1. **Push to Git repository** (GitHub, GitLab, etc.)

2. **On server, pull and setup**:
   ```bash
   ssh root@137.184.93.111
   cd ~/stop-reg-back-end
   git pull origin main
   
   # Install all dependencies (needed for TypeScript build)
   npm install
   
   # Build TypeScript
   npm run build
   
   # Restart application
   pm2 restart stop-reg-backend
   ```

**Alternative (Recommended):** Build locally, commit `dist/` folder, then on server:
```bash
git pull origin main
npm install --omit=dev
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

### Application Issues

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
   # Or for newer systems
   ss -tulpn | grep 8080
   ```

4. **Restart if needed**:
   ```bash
   pm2 restart stop-reg-backend
   ```

### Node.js Installation Issues

1. **Node.js command not found after installation**:
   ```bash
   # Check if Node.js is installed
   which node
   which npm
   
   # If not found, check PATH
   echo $PATH
   
   # For NVM installations, reload shell
   source ~/.bashrc
   # Or
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```

2. **Permission denied errors**:
   ```bash
   # If using root, this shouldn't be an issue
   # But if using a different user, you may need:
   sudo npm install -g pm2
   ```

3. **npm install fails**:
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Try installing with verbose output
   npm install --production --verbose
   ```

4. **TypeScript build fails**:
   ```bash
   # Ensure TypeScript is installed
   npm install -g typescript
   
   # Or install locally
   npm install typescript --save-dev
   ```
   
   **Note:** If you're using the recommended deployment method (Method 1), TypeScript builds happen locally, not on the server. If you see TypeScript errors during deployment, check your local build first.

### MongoDB Connection Issues

1. **"Database connected" not appearing in logs**:
   ```bash
   # Check PM2 logs for MongoDB connection errors
   pm2 logs stop-reg-backend
   
   # Verify MONGODB_URI is set
   ssh root@137.184.93.111
   cd ~/stop-reg-back-end
   cat .env | grep MONGODB_URI
   ```

2. **MongoDB connection timeout**:
   - **For MongoDB Atlas**: Ensure your server IP (`137.184.93.111`) is whitelisted in Network Access
   - **For local MongoDB**: Check if MongoDB is running:
     ```bash
     systemctl status mongod
     # If not running:
     systemctl start mongod
     ```

3. **Authentication failed**:
   - Verify username and password in connection string
   - For MongoDB Atlas, ensure database user exists and has correct permissions
   - For local MongoDB, ensure authentication is configured correctly

4. **Connection string format errors**:
   - **MongoDB Atlas**: Use `mongodb+srv://` format
   - **Local MongoDB**: Use `mongodb://` format
   - Ensure special characters in password are URL-encoded (e.g., `@` becomes `%40`)

5. **Test MongoDB connection manually**:
   ```bash
   # Install MongoDB client tools (optional)
   apt-get install -y mongodb-mongosh  # Ubuntu/Debian
   # or
   yum install -y mongodb-mongosh     # CentOS/RHEL
   
   # Test connection
   mongosh "your_connection_string"
   ```

6. **Check MongoDB connection from server**:
   ```bash
   # Test if MongoDB port is accessible
   telnet your-mongodb-host 27017
   # Or for MongoDB Atlas (port 27017 or default)
   nc -zv your-mongodb-host 27017
   ```

## Firewall Configuration

Since this is a bare-metal server, you may need to configure the firewall to allow traffic on port 8080:

### For Ubuntu/Debian (UFW):

```bash
# Allow port 8080
ufw allow 8080/tcp

# Or allow from specific IP only (more secure)
ufw allow from YOUR_IP_ADDRESS to any port 8080

# Enable firewall (if not already enabled)
ufw enable

# Check firewall status
ufw status
```

### For CentOS/RHEL (firewalld):

```bash
# Allow port 8080
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --reload

# Check firewall status
firewall-cmd --list-all
```

### For iptables (if using):

```bash
# Allow port 8080
iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
iptables-save > /etc/iptables/rules.v4
```

## Security Notes

- Never commit `.env` file to Git
- Use SSH keys instead of passwords when possible
- Keep dependencies updated
- Use firewall to restrict access to port 8080 if needed
- Consider using a reverse proxy (nginx/Apache) in front of your Node.js application for better security
- Regularly update Node.js and npm: `npm install -g npm@latest`

