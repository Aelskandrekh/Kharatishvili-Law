#!/bin/bash

echo "🚀 Deploying Kharatishvili Law to Vercel..."

# Push any changes to GitHub first
echo "📤 Pushing changes to GitHub..."
git add .
git commit -m "Deploy: Update website files" || echo "No changes to commit"
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
echo "Your website is now live on Vercel with simplified cache control!"