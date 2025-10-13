#!/bin/bash

echo "🚀 VeriFil Deployment Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Go to https://vercel.com"
    echo "3. Import your repository"
    echo "4. Deploy!"
    echo ""
    echo "📋 Don't forget to:"
    echo "- Set up your Flask backend (Heroku/Railway/Render)"
    echo "- Update NEXT_PUBLIC_API_URL in Vercel environment variables"
    echo "- Connect your custom domain"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

