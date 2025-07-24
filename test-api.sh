#!/bin/bash

# Skillara API Test Script
# Usage: ./test-api.sh

echo "🧪 Starting Skillara API Testing..."
echo "=================================="

BASE_URL="http://localhost:4000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "Method: $method | Endpoint: $endpoint"

    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ SUCCESS (HTTP $http_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ FAILED (HTTP $http_code)${NC}"
        echo "$body"
    fi

    # Return response for chaining
    echo "$body"
}

# Check if server is running
echo "🔄 Checking if server is running..."
health_response=$(curl -s --connect-timeout 3 "$BASE_URL/health" 2>/dev/null)
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Server is not running at $BASE_URL${NC}"
    echo "Please start the server with: manage-containers.bat dev"
    exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}"

# 1. Health Checks
echo -e "\n${YELLOW}=== HEALTH CHECKS ===${NC}"

test_endpoint "GET" "/health" "" "General Health Check"
test_endpoint "GET" "/api/skills/health" "" "Skill Service Health Check"

# 2. Create Skills
echo -e "\n${YELLOW}=== CREATING SKILLS ===${NC}"

# Create TypeScript skill
typescript_data='{
  "name": "TypeScript Programming",
  "category": "Programming Languages",
  "description": "Advanced TypeScript development for building scalable applications"
}'
typescript_response=$(test_endpoint "POST" "/api/skills" "$typescript_data" "Create TypeScript Skill")
typescript_id=$(echo "$typescript_response" | jq -r '.data.id // empty' 2>/dev/null)

# Create React skill
react_data='{
  "name": "React Development",
  "category": "Frontend Frameworks",
  "description": "Building modern web applications with React and its ecosystem"
}'
react_response=$(test_endpoint "POST" "/api/skills" "$react_data" "Create React Skill")
react_id=$(echo "$react_response" | jq -r '.data.id // empty' 2>/dev/null)

# Create Node.js skill
nodejs_data='{
  "name": "Node.js Backend Development",
  "category": "Backend Technologies",
  "description": "Server-side development using Node.js and Express"
}'
nodejs_response=$(test_endpoint "POST" "/api/skills" "$nodejs_data" "Create Node.js Skill")
nodejs_id=$(echo "$nodejs_response" | jq -r '.data.id // empty' 2>/dev/null)

# 3. Test Skill Assessments
echo -e "\n${YELLOW}=== SKILL ASSESSMENTS ===${NC}"

if [ -n "$typescript_id" ] && [ "$typescript_id" != "null" ]; then
    assess_data='{
      "userId": "test-user-001",
      "skillId": "'$typescript_id'",
      "level": 5,
      "experience": "5+ years of professional TypeScript development, led multiple projects"
    }'
    test_endpoint "POST" "/api/skills/assess" "$assess_data" "Assess TypeScript Skill (Expert)"
fi

if [ -n "$react_id" ] && [ "$react_id" != "null" ]; then
    assess_data='{
      "userId": "test-user-001",
      "skillId": "'$react_id'",
      "level": 3,
      "experience": "2 years building React applications with hooks and context"
    }'
    test_endpoint "POST" "/api/skills/assess" "$assess_data" "Assess React Skill (Intermediate)"
fi

if [ -n "$nodejs_id" ] && [ "$nodejs_id" != "null" ]; then
    assess_data='{
      "userId": "test-user-002",
      "skillId": "'$nodejs_id'",
      "level": 2,
      "experience": "6 months working with Node.js and Express framework"
    }'
    test_endpoint "POST" "/api/skills/assess" "$assess_data" "Assess Node.js Skill (Beginner)"
fi

# 4. Get User Skills
echo -e "\n${YELLOW}=== USER SKILL QUERIES ===${NC}"

test_endpoint "GET" "/api/users/test-user-001/skills" "" "Get Skills for User 001"
test_endpoint "GET" "/api/users/test-user-002/skills" "" "Get Skills for User 002"

# 5. Error Cases
echo -e "\n${YELLOW}=== ERROR HANDLING TESTS ===${NC}"

# Missing fields
missing_fields='{
  "name": "Incomplete Skill"
}'
test_endpoint "POST" "/api/skills" "$missing_fields" "Missing Required Fields"

# Invalid level
invalid_level='{
  "userId": "test-user",
  "skillId": "fake-id",
  "level": 10,
  "experience": "Invalid level test"
}'
test_endpoint "POST" "/api/skills/assess" "$invalid_level" "Invalid Skill Level"

# Non-existent user
test_endpoint "GET" "/api/users/non-existent-user/skills" "" "Non-existent User"

# 6. Summary
echo -e "\n${YELLOW}=== TEST SUMMARY ===${NC}"
echo "🎯 API Testing completed!"
echo "📊 Check the responses above for success/failure status"
echo ""
echo "💡 To verify data persistence, check the database:"
echo "   podman exec -it skillara-analyzer_postgres_1 psql -U skillara_user -d skillara_dev"
echo "   SELECT skill_name, category FROM skills_taxonomy ORDER BY skill_name;"
echo ""
echo -e "${GREEN}✅ All tests completed!${NC}"
