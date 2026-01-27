#!/bin/bash
# Deploy Clawdio to GitHub Pages or Vercel

echo "🦊 Clawdio Deployment"
echo "====================="

# Build the project
echo "Building..."
npm run build

# Check if GITHUB_TOKEN is set for GitHub Pages
if [ -n "$GITHUB_TOKEN" ]; then
    echo "Deploying to GitHub Pages..."
    # Using gh CLI or direct push
    npx gh-pages -d build
elif command -v vercel &> /dev/null; then
    echo "Deploying to Vercel..."
    npx vercel --prod
else
    echo ""
    echo "To deploy, run one of these commands:"
    echo ""
    echo "GitHub Pages:"
    echo "  npx gh-pages -d build"
    echo ""
    echo "Vercel:"
    echo "  npx vercel"
    echo ""
    echo "Or push to GitHub:"
    echo "  git remote add origin https://github.com/ahmadshiddiqn/clawdio.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
fi
