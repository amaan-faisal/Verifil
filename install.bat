@echo off
echo 🚀 Setting up VeriFil - Crypto Wallet Tracker
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo ✅ Node.js and Python are installed

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install flask flask-cors requests

if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo ✅ Python dependencies installed

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Start the backend: python app.py
echo 2. Start the frontend: npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo The application will use demo data initially.
echo To connect to real wallets, make sure the Flask backend is running on port 5000.
pause

