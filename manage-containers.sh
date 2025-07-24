#!/bin/bash

# Skillara Container Management Script
# This script manages Podman containers for the Skillara project

set -e  # Exit on any error

PROJECT_NAME="skillara-analyzer"
COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if podman-compose is available
check_podman_compose() {
    if ! command -v podman-compose &> /dev/null; then
        print_error "podman-compose is not installed or not in PATH"
        print_status "Please install podman-compose: pip install podman-compose"
        exit 1
    fi
}

# Function to start containers
start_containers() {
    print_status "Starting Skillara containers with Podman..."

    check_podman_compose

    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "docker-compose.yml not found in current directory"
        exit 1
    fi

    print_status "Starting PostgreSQL and Node containers..."
    podman-compose up -d

    print_status "Waiting for containers to be ready..."
    sleep 5

    # Check if PostgreSQL is ready
    print_status "Checking PostgreSQL health..."
    for i in {1..30}; do
        if podman exec -it ${PROJECT_NAME}_postgres_1 pg_isready -U skillara_user -d skillara_dev &>/dev/null; then
            print_success "PostgreSQL is ready!"
            break
        fi

        if [ $i -eq 30 ]; then
            print_error "PostgreSQL failed to start within 30 seconds"
            print_status "Checking container logs:"
            podman logs ${PROJECT_NAME}_postgres_1
            exit 1
        fi

        print_status "Waiting for PostgreSQL... ($i/30)"
        sleep 1
    done

    # Show container status
    print_status "Container Status:"
    podman ps --filter "name=${PROJECT_NAME}"

    print_success "✅ All containers are running!"
    print_status "📊 Services available:"
    print_status "   - PostgreSQL: localhost:5432"
    print_status "   - Database: skillara_dev"
    print_status "   - User: skillara_user"

    print_status "🧪 Test database connection:"
    print_status "   cd backend && npm run db:test"

    print_status "🚀 Start API server:"
    print_status "   cd backend && npm run dev"
}

# Function to stop containers
stop_containers() {
    print_status "Stopping Skillara containers..."

    check_podman_compose

    podman-compose down

    print_success "✅ All containers stopped!"
}

# Function to restart containers
restart_containers() {
    print_status "Restarting Skillara containers..."
    stop_containers
    sleep 2
    start_containers
}

# Function to show container status
show_status() {
    print_status "Skillara Container Status:"

    echo ""
    print_status "Running Containers:"
    podman ps --filter "name=${PROJECT_NAME}" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

    echo ""
    print_status "All Project Containers:"
    podman ps -a --filter "name=${PROJECT_NAME}" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
}

# Function to show logs
show_logs() {
    local service=${1:-"postgres"}
    print_status "Showing logs for ${service}..."

    case $service in
        "postgres"|"db"|"database")
            podman logs -f ${PROJECT_NAME}_postgres_1
            ;;
        "node"|"api")
            podman logs -f ${PROJECT_NAME}_node_1
            ;;
        *)
            print_error "Unknown service: $service"
            print_status "Available services: postgres, node"
            exit 1
            ;;
    esac
}

# Function to clean up (remove containers and volumes)
cleanup() {
    print_warning "This will remove all containers and volumes. Are you sure? (y/N)"
    read -r response

    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_status "Cleaning up containers and volumes..."
        podman-compose down -v
        podman system prune -f
        print_success "✅ Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Skillara Container Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start all containers"
    echo "  stop      Stop all containers"
    echo "  restart   Restart all containers"
    echo "  status    Show container status"
    echo "  logs      Show container logs (postgres|node)"
    echo "  cleanup   Remove containers and volumes"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs postgres"
    echo "  $0 status"
}

# Main script logic
case "${1:-help}" in
    "start")
        start_containers
        ;;
    "stop")
        stop_containers
        ;;
    "restart")
        restart_containers
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
