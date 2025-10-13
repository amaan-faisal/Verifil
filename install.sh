#!/bin/bash

echo "🚀 Setting up VeriFil - Crypto Wallet Tracker"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Node.js and Python are installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install flask flask-cors requests

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ Python dependencies installed"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: python3 app.py"
echo "2. Start the frontend: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "The application will use demo data initially."
echo "To connect to real wallets, make sure the Flask backend is running on port 5000."

