#!/bin/bash

echo "Starting MilkyTea Application..."
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed. Please install Java 11 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "Building backend..."
cd backend
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "Error: Backend build failed."
    exit 1
fi

echo ""
echo "Starting backend server on port 8080..."
java -jar target/milkytea-backend-1.0.0.jar &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

cd ../frontend

echo ""
echo "Installing frontend dependencies (if needed)..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo "Starting frontend server on port 3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "MilkyTea is now running!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8080"
echo "H2 Console: http://localhost:8080/h2-console"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Wait for user to press Ctrl+C
wait
