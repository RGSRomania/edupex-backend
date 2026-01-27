#!/bin/bash

# EduPex Local Development Quick Start
# This script starts both backend and frontend for local testing

echo "🚀 EduPex Local Development Environment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo "📍 Checking MongoDB..."
if pgrep -q mongod; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB is NOT running${NC}"
    echo "   Start MongoDB with: mongod"
    exit 1
fi

# Set environment
export NODE_ENV=development

# Navigate to backend
cd "$(dirname "$0")/backend"

echo ""
echo -e "${YELLOW}📦 Starting Backend Server...${NC}"
echo "   Environment: $NODE_ENV"
echo "   Port: 5000"
echo "   Database: mongodb://localhost:27017/edupex"
echo ""

# Start backend in background
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📱 Starting Frontend...${NC}"
echo "   Port: 3000"
echo "   Backend: http://localhost:5000"
echo ""

# Navigate to frontend
cd ../frontend

# Start frontend
npm start &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ Both servers are starting!${NC}"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "🔍 API Status: http://localhost:5000/api/health"
echo ""
echo "⚠️  To stop the servers:"
echo "   Press Ctrl+C in this terminal"
echo ""

# Wait for both processes
wait

