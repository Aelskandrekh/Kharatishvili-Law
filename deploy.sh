#!/bin/bash

echo "🚀 Deploying Kharatishvili Law to Vercel..."

# Run build script for cache-busting
echo "🔧 Building with cache-busting..."
node build.js

# Add changes to git
echo "📝 Committing build changes..."
git add .
git commit -m "Auto-build: Update cache-busting parameters before deployment" || echo "No changes to commit"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main || echo "Push failed, continuing with deployment"

# Fix npm permissions if needed
echo "Fixing npm permissions..."
sudo chown -R $(whoami) ~/.npm 2>/dev/null || true

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install Vercel CLI if not installed
echo "Installing Vercel CLI..."
npm install -g vercel

# Deploy the website
echo "Deploying website..."
vercel --prod

echo "✅ Deployment complete!"
echo "Your website is now live on Vercel with fresh cache-busting!"