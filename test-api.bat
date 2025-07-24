@echo off
setlocal enabledelayedexpansion

REM Skillara API Test Script for Windows
REM Usage: test-api.bat

echo.
echo ===========================================
echo    🧪 Skillara API Testing (Windows)
echo ===========================================

set BASE_URL=http://localhost:4000

REM Check if server is running
echo 🔄 Checking if server is running...
curl -s --connect-timeout 3 %BASE_URL%/health >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ Server is not running at %BASE_URL%
    echo Please start the server with: manage-containers.bat dev
    pause
    exit /b 1
)
echo ✅ Server is running

REM 1. Health Checks
echo.
echo === 🏥 HEALTH CHECKS ===
echo.

echo 1. General Health Check:
curl -X GET %BASE_URL%/health -H "Content-Type: application/json"
echo.

echo 2. Skill Service Health Check:
curl -X GET %BASE_URL%/api/skills/health -H "Content-Type: application/json"
echo.

REM 2. Create Skills
echo.
echo === 🆕 CREATING SKILLS ===
echo.

echo 3. Creating TypeScript Skill:
curl -X POST %BASE_URL%/api/skills ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"TypeScript Programming\", \"category\": \"Programming Languages\", \"description\": \"Advanced TypeScript development for scalable applications\"}"
echo.

echo 4. Creating React Skill:
curl -X POST %BASE_URL%/api/skills ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"React Development\", \"category\": \"Frontend Frameworks\", \"description\": \"Building modern web applications with React\"}"
echo.

echo 5. Creating Node.js Skill:
curl -X POST %BASE_URL%/api/skills ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Node.js Backend\", \"category\": \"Backend Technologies\", \"description\": \"Server-side development with Node.js\"}"
echo.

echo 6. Creating PostgreSQL Skill:
curl -X POST %BASE_URL%/api/skills ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"PostgreSQL Database\", \"category\": \"Database Technologies\", \"description\": \"Database design and management\"}"
echo.

echo 7. Creating Docker Skill:
curl -X POST %BASE_URL%/api/skills ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Docker Containerization\", \"category\": \"DevOps Tools\", \"description\": \"Container orchestration and deployment\"}"
echo.

REM 3. Test Skill Assessments
echo.
echo === 📊 SKILL ASSESSMENTS ===
echo.
echo NOTE: Replace 'SKILL_ID_HERE' with actual IDs from skill creation responses

echo 8. Sample Assessment (Expert Level):
curl -X POST %BASE_URL%/api/skills/assess ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\": \"test-user-001\", \"skillId\": \"replace-with-actual-skill-id\", \"level\": 5, \"experience\": \"5+ years professional experience\"}"
echo.

echo 9. Sample Assessment (Intermediate Level):
curl -X POST %BASE_URL%/api/skills/assess ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\": \"test-user-001\", \"skillId\": \"replace-with-actual-skill-id\", \"level\": 3, \"experience\": \"2 years experience\"}"
echo.

REM 4. Get User Skills
echo.
echo === 👤 USER SKILL QUERIES ===
echo.

echo 10. Get Skills for User 001:
curl -X GET %BASE_URL%/api/users/test-user-001/skills -H "Content-Type: application/json"
echo.

echo 11. Get Skills for User 002:
curl -X GET %BASE_URL%/api/users/test-user-002/skills -H "Content-Type: application/json"
echo.

REM 5. Error Cases
echo.
echo === ❌ ERROR HANDLING TESTS ===
echo.

echo 12. Test Missing Required Fields:
curl -X POST %BASE_URL%/api/skills ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Incomplete Skill\"}"
echo.

echo 13. Test Invalid Skill Level:
curl -X POST %BASE_URL%/api/skills/assess ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\": \"test-user\", \"skillId\": \"fake-id\", \"level\": 10, \"experience\": \"Invalid level\"}"
echo.

echo 14. Test Non-existent User:
curl -X GET %BASE_URL%/api/users/non-existent-user/skills -H "Content-Type: application/json"
echo.

REM Summary
echo.
echo ===========================================
echo    📊 TEST SUMMARY
echo ===========================================
echo.
echo ✅ API Testing completed!
echo.
echo 💡 Next Steps:
echo    1. Check responses above for success/failure status
echo    2. Copy skill IDs from create responses to test assessments
echo    3. Verify data in database with:
echo       podman exec -it skillara-analyzer_postgres_1 psql -U skillara_user -d skillara_dev
echo.
echo 🎯 Manual Testing:
echo    - Use CURL_API_TESTING.md for detailed examples
echo    - Replace placeholder IDs with actual skill IDs
echo    - Test with different user IDs and skill levels
echo.

pause
