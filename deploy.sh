#!/bin/bash

echo "🚀 Deploying Kharatishvili Law to Vercel..."

# Fix npm permissions if needed
echo "Fixing npm permissions..."
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install Vercel CLI if not installed
echo "Installing Vercel CLI..."
npm install -g vercel

# Login to Vercel (this will open browser)
echo "Logging into Vercel..."
vercel login

# Deploy the website
echo "Deploying website..."
vercel --prod

echo "✅ Deployment complete!"
echo "Your website is now live on Vercel!"