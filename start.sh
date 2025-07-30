#!/bin/bash

# SquadGPT Startup Script
echo "🚀 Starting SquadGPT..."

# Check if .env file exists in backend
if [ ! -f "squadgpt-backend/.env" ]; then
    echo "⚠️  Warning: .env file not found in squadgpt-backend/"
    echo "Please create squadgpt-backend/.env with your OpenAI API key:"
    echo "OPENAI_API_KEY=your_openai_api_key_here"
    echo "PORT=3001"
    echo "NODE_ENV=development"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "squadgpt-backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd squadgpt-backend
    npm install
    cd ..
fi

if [ ! -d "squadgpt-frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd squadgpt-frontend
    npm install
    cd ..
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd squadgpt-backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd squadgpt-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ SquadGPT is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping SquadGPT..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# Wait for both processes
wait 