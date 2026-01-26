#!/bin/bash

# 🚀 LOCAL DEVELOPMENT STARTUP SCRIPT
# Start both backend and frontend servers locally

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║     🚀 LOCAL DEVELOPMENT ENVIRONMENT STARTUP                  ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found:${NC} $(node --version)"
echo ""

# Navigate to project directory
PROJECT_DIR="/Users/mdica/PycharmProjects/EduPex"
cd "$PROJECT_DIR" || exit 1

echo -e "${BLUE}📂 Project directory:${NC} $PROJECT_DIR"
echo ""

# Check if .env exists
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo "Creating .env from template..."
    cat > "$PROJECT_DIR/.env" << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex
JWT_SECRET=RY7VCg2pK9XD8LqkwZfA4mH5tsBjE3QxNuP6JbTz1h0MUneSdF
SUPABASE_URL=https://szbjppcmhshegyewsveu.supabase.co
SUPABASE_SERVICE_KEY=eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YmpwcGNtaHNoZWd5ZXdzdmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIwODg4NiwiZXhwIjoyMDcxNzg0ODg2fQ.9DFChq7KL_KhjyNxUkhlBWDXuMiRZkpuvAS-kS3SlH0
LLM_PROVIDER=huggingface
HUGGINGFACE_API_KEY=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
CURRICULUM_JSON_PATH=./curriculum_structure.json
LOG_LEVEL=debug
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
fi

# Check if frontend .env exists
if [ ! -f "$PROJECT_DIR/frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env file not found!${NC}"
    echo "Creating frontend/.env..."
    cat > "$PROJECT_DIR/frontend/.env" << 'EOF'
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=30000
REACT_APP_DEBUG_MODE=true
REACT_APP_CURRICULUM_SOURCE=local
GENERATE_SOURCEMAP=false
CI=false
EOF
    echo -e "${GREEN}✅ Created frontend/.env file${NC}"
fi

echo ""
echo -e "${BLUE}📋 Checking dependencies...${NC}"
echo ""

# Check if node_modules exists for backend
if [ ! -d "$PROJECT_DIR/backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies missing. Installing...${NC}"
    cd "$PROJECT_DIR/backend"
    npm install --silent
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    cd "$PROJECT_DIR"
fi

# Check if node_modules exists for frontend
if [ ! -d "$PROJECT_DIR/frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies missing. Installing...${NC}"
    cd "$PROJECT_DIR/frontend"
    npm install --silent
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    cd "$PROJECT_DIR"
fi

echo ""
echo -e "${GREEN}✅ All dependencies ready${NC}"
echo ""

# Check port availability
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Check if ports are in use
echo -e "${BLUE}🔍 Checking ports...${NC}"
echo ""

if check_port 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use!${NC}"
    echo "   Kill it with: lsof -i :5000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
    echo ""
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use!${NC}"
    echo "   Kill it with: lsof -i :3000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
    echo ""
fi

echo ""
echo -e "${GREEN}✅ Port check complete${NC}"
echo ""

# Display startup instructions
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 STARTUP INSTRUCTIONS                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}📝 Open TWO terminals and run:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd $PROJECT_DIR/backend"
echo "  npm start"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd $PROJECT_DIR/frontend"
echo "  npm start"
echo ""
echo -e "${GREEN}Then open:${NC} http://localhost:3000"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     QUICK REFERENCE                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo -e "${BLUE}Check backend health:${NC}"
echo "  curl http://localhost:5000/api/health"
echo ""
echo -e "${BLUE}View environment:${NC}"
echo "  cat .env"
echo ""
echo -e "${BLUE}View logs:${NC}"
echo "  Terminal where server is running (Terminal 1 or 2)"
echo ""
echo -e "${BLUE}Restart servers:${NC}"
echo "  Press Ctrl+C in the terminal running the server, then npm start"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ENVIRONMENT READY! 🚀                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

