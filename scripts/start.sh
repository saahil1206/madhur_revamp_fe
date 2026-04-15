#!/bin/bash

export PATH=$PATH:/usr/bin:/usr/local/bin
export PM2_HOME=/root/.pm2

echo "Starting deployment..."

##############################
# Backend Deploy
##############################
echo "Deploying backend..."

cd /var/www/madhurbazarbackend || exit

echo "Installing backend dependencies..."
/usr/bin/npm install

echo "Restarting backend with PM2..."
/usr/bin/pm2 restart madhur-backend || /usr/bin/pm2 start app.js --name madhur-backend

##############################
# Frontend Deploy
##############################
echo "Deploying frontend..."

cd /var/www/madhurbazar || exit

echo "Installing frontend dependencies..."
/usr/bin/npm install

echo "Building frontend..."
/usr/bin/npm run build

##############################
# Reload Nginx
##############################
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Deployment completed!"
