@echo off
REM Skillara Container Management Script for Windows
REM This script manages Podman containers for the Skillara project

setlocal enabledelayedexpansion

set PROJECT_NAME=skillara-analyzer
set COMPOSE_FILE=docker-compose.yml

REM Check if podman-compose is available
where podman-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] podman-compose is not installed or not in PATH
    echo Please install podman-compose: pip install podman-compose
    exit /b 1
)

REM Function to start containers
if "%1"=="start" (
    echo [INFO] Starting Skillara containers with Podman...

    if not exist "%COMPOSE_FILE%" (
        echo [ERROR] docker-compose.yml not found in current directory
        exit /b 1
    )

    echo [INFO] Starting PostgreSQL and Node containers...
    podman-compose up -d

    echo [INFO] Waiting for containers to be ready...
    timeout /t 5 /nobreak >nul

    echo [INFO] Checking PostgreSQL health...
    for /l %%i in (1,1,30) do (
        podman exec -it %PROJECT_NAME%_postgres_1 pg_isready -U skillara_user -d skillara_dev >nul 2>nul
        if !errorlevel! equ 0 (
            echo [SUCCESS] PostgreSQL is ready!
            goto :postgres_ready
        )
        echo [INFO] Waiting for PostgreSQL... (%%i/30)
        timeout /t 1 /nobreak >nul
    )

    echo [ERROR] PostgreSQL failed to start within 30 seconds
    echo [INFO] Checking container logs:
    podman logs %PROJECT_NAME%_postgres_1
    exit /b 1

    :postgres_ready
    echo [INFO] Container Status:
    podman ps --filter "name=%PROJECT_NAME%"

    echo.
    echo [SUCCESS] ✅ All containers are running!
    echo [INFO] 📊 Services available:
    echo [INFO]    - PostgreSQL: localhost:5432
    echo [INFO]    - Database: skillara_dev
    echo [INFO]    - User: skillara_user
    echo.
    echo [INFO] 🧪 Test database connection:
    echo [INFO]    cd backend ^&^& npm run db:test
    echo.
    echo [INFO] 🚀 Start API server:
    echo [INFO]    cd backend ^&^& npm run dev

    goto :end
)

REM Function to stop containers
if "%1"=="stop" (
    echo [INFO] Stopping Skillara containers...
    podman-compose down
    echo [SUCCESS] ✅ All containers stopped!
    goto :end
)

REM Function to restart containers
if "%1"=="restart" (
    echo [INFO] Restarting Skillara containers...
    call "%0" stop
    timeout /t 2 /nobreak >nul
    call "%0" start
    goto :end
)

REM Function to show container status
if "%1"=="status" (
    echo [INFO] Skillara Container Status:
    echo.
    echo [INFO] Running Containers:
    podman ps --filter "name=%PROJECT_NAME%"
    echo.
    echo [INFO] All Project Containers:
    podman ps -a --filter "name=%PROJECT_NAME%"
    goto :end
)

REM Function to show logs
if "%1"=="logs" (
    set service=%2
    if "!service!"=="" set service=postgres
    echo [INFO] Showing logs for !service!...

    if "!service!"=="postgres" (
        podman logs -f %PROJECT_NAME%_postgres_1
    ) else if "!service!"=="db" (
        podman logs -f %PROJECT_NAME%_postgres_1
    ) else if "!service!"=="database" (
        podman logs -f %PROJECT_NAME%_postgres_1
    ) else if "!service!"=="node" (
        podman logs -f %PROJECT_NAME%_node_1
    ) else if "!service!"=="api" (
        podman logs -f %PROJECT_NAME%_node_1
    ) else (
        echo [ERROR] Unknown service: !service!
        echo [INFO] Available services: postgres, node
        exit /b 1
    )
    goto :end
)

REM Function to clean up
if "%1"=="cleanup" (
    echo [WARNING] This will remove all containers and volumes. Are you sure? (y/N)
    set /p response=
    if /i "!response!"=="y" (
        echo [INFO] Cleaning up containers and volumes...
        podman-compose down -v
        podman system prune -f
        echo [SUCCESS] ✅ Cleanup completed!
    ) else (
        echo [INFO] Cleanup cancelled.
    )
    goto :end
)

REM Function to run database tests
if "%1"=="test" (
    echo [INFO] Testing database connection and data saving...

    REM Check if containers are running
    podman ps --filter "name=%PROJECT_NAME%_postgres" --quiet >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] PostgreSQL container is not running
        echo [INFO] Start containers first: %0 start
        exit /b 1
    )

    echo [INFO] Switching to backend directory...
    if not exist "backend" (
        echo [ERROR] Backend directory not found
        exit /b 1
    )

    cd backend

    echo [INFO] Testing database connection...
    call npm run db:test
    if %errorlevel% neq 0 (
        echo [ERROR] Database connection test failed
        exit /b 1
    )

    echo [INFO] Testing data saving through services...
    call npm run test:save-data
    if %errorlevel% neq 0 (
        echo [ERROR] Data saving test failed
        exit /b 1
    )

    echo [SUCCESS] ✅ All tests passed!
    cd ..
    goto :end
)

REM Function to start development environment
if "%1"=="dev" (
    echo [INFO] Starting development environment...

    REM Start containers if not running
    podman ps --filter "name=%PROJECT_NAME%_postgres" --quiet >nul 2>nul
    if %errorlevel% neq 0 (
        echo [INFO] Starting containers first...
        call "%0" start
        if !errorlevel! neq 0 exit /b 1
    )

    echo [INFO] Starting API server...
    cd backend
    call npm run dev
    cd ..
    goto :end
)

REM Show help if no valid command or help requested
:show_help
echo Skillara Container Management Script for Windows
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   start     Start all containers
echo   stop      Stop all containers
echo   restart   Restart all containers
echo   status    Show container status
echo   logs      Show container logs (postgres^|node)
echo   cleanup   Remove containers and volumes
echo   test      Run database tests
echo   dev       Start development environment
echo   help      Show this help message
echo.
echo Examples:
echo   %0 start
echo   %0 logs postgres
echo   %0 status
echo   %0 test
echo   %0 dev

if "%1"=="help" goto :end
if "%1"=="--help" goto :end
if "%1"=="-h" goto :end
if "%1"=="" goto :end

echo [ERROR] Unknown command: %1
goto :show_help

:end
