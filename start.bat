@echo off
echo Starting MilkyTea Application...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo Error: Java is not installed. Please install Java 11 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js 14 or higher.
    exit /b 1
)

echo Building backend...
cd backend
call mvn clean package -DskipTests
if errorlevel 1 (
    echo Error: Backend build failed.
    exit /b 1
)

echo.
echo Starting backend server on port 8080...
start "MilkyTea Backend" java -jar target/milkytea-backend-1.0.0.jar

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

cd ..\frontend

echo.
echo Installing frontend dependencies (if needed)...
if not exist "node_modules\" (
    call npm install
)

echo.
echo Starting frontend server on port 3000...
start "MilkyTea Frontend" npm start

echo.
echo ============================================
echo MilkyTea is now running!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080
echo H2 Console: http://localhost:8080/h2-console
echo ============================================
echo.
echo Close the command windows to stop the servers
pause
