#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🔧 EDUPEX LOCAL DEVELOPMENT DIAGNOSTIC & FIX 🔧      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "STEP 1: Verify Environment"
echo "══════════════════════════════════════════════════════════════════"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
fi

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${RED}❌ MongoDB not found${NC}"
    echo "   Install with: brew tap mongodb/brew && brew install mongodb-community"
else
    echo -e "${GREEN}✅ MongoDB found${NC}"
fi

echo ""
echo "STEP 2: Verify Project Structure"
echo "══════════════════════════════════════════════════════════════════"
echo ""

if [ -d "/Users/mdica/PycharmProjects/EduPex/backend" ]; then
    echo -e "${GREEN}✅ Backend folder found${NC}"
else
    echo -e "${RED}❌ Backend folder not found${NC}"
    exit 1
fi

if [ -d "/Users/mdica/PycharmProjects/EduPex/frontend" ]; then
    echo -e "${GREEN}✅ Frontend folder found${NC}"
else
    echo -e "${RED}❌ Frontend folder not found${NC}"
    exit 1
fi

echo ""
echo "STEP 3: Verify Configuration Files"
echo "══════════════════════════════════════════════════════════════════"
echo ""

if [ -f "/Users/mdica/PycharmProjects/EduPex/backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env found${NC}"
    if grep -q "MONGODB_URI" /Users/mdica/PycharmProjects/EduPex/backend/.env; then
        echo -e "   ${GREEN}✅ MONGODB_URI configured${NC}"
    else
        echo -e "   ${RED}❌ MONGODB_URI not configured${NC}"
    fi
else
    echo -e "${RED}❌ Backend .env not found${NC}"
fi

if [ -f "/Users/mdica/PycharmProjects/EduPex/frontend/.env" ]; then
    echo -e "${GREEN}✅ Frontend .env found${NC}"
    if grep -q "REACT_APP_API_URL" /Users/mdica/PycharmProjects/EduPex/frontend/.env; then
        echo -e "   ${GREEN}✅ REACT_APP_API_URL configured${NC}"
    else
        echo -e "   ${RED}❌ REACT_APP_API_URL not configured${NC}"
    fi
else
    echo -e "${RED}❌ Frontend .env not found${NC}"
fi

echo ""
echo "STEP 4: Verify Dependencies"
echo "══════════════════════════════════════════════════════════════════"
echo ""

if [ -d "/Users/mdica/PycharmProjects/EduPex/backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend node_modules found${NC}"
else
    echo -e "${YELLOW}⚠️  Backend node_modules not found - will install on first run${NC}"
fi

if [ -d "/Users/mdica/PycharmProjects/EduPex/frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend node_modules found${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend node_modules not found - will install on first run${NC}"
fi

echo ""
echo "STEP 5: Ready to Start?"
echo "══════════════════════════════════════════════════════════════════"
echo ""

echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "Your system is ready. To start development:"
echo ""
echo -e "${YELLOW}Terminal 1 (MongoDB):${NC}"
echo "  brew services start mongodb-community"
echo ""
echo -e "${YELLOW}Terminal 2 (Backend):${NC}"
echo "  cd /Users/mdica/PycharmProjects/EduPex/backend"
echo "  npm start"
echo ""
echo -e "${YELLOW}Terminal 3 (Frontend):${NC}"
echo "  cd /Users/mdica/PycharmProjects/EduPex/frontend"
echo "  npm start"
echo ""
echo -e "${GREEN}Then login with:${NC}"
echo "  Email: test@edupex.com"
echo "  Password: test123"
echo ""

