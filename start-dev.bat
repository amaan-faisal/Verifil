@echo off
echo 🚀 Starting VeriFil Development Environment
echo ==========================================

echo Starting Flask backend on port 5000...
start "Flask Backend" cmd /k "python app.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Next.js frontend on port 3000...
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window
pause >nul

