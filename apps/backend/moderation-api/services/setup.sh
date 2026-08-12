#!/bin/bash

# Microservices Setup Script
# This script clones and sets up all required services

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.json"
SERVICES_DIR="$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is not installed. Please install jq first.${NC}"
        echo "On macOS: brew install jq"
        echo "On Ubuntu: sudo apt-get install jq"
        exit 1
    fi
}

# Parse config file
parse_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        echo -e "${RED}Error: config.json not found at $CONFIG_FILE${NC}"
        exit 1
    fi
}

# Clone a single service
clone_service() {
    local service_name="$1"
    local repo_url="$2"
    local branch="$3"
    local target_dir="$SERVICES_DIR/$service_name"

    if [ -d "$target_dir" ]; then
        echo -e "${YELLOW}Service '$service_name' already exists. Skipping clone.${NC}"
        return 0
    fi

    echo -e "${GREEN}Cloning $service_name...${NC}"
    if git clone --branch "$branch" "$repo_url" "$target_dir"; then
        echo -e "${GREEN}Successfully cloned $service_name${NC}"
    else
        echo -e "${RED}Failed to clone $service_name from $repo_url${NC}"
        return 1
    fi
}

# Setup a single service
setup_service() {
    local service_name="$1"
    local target_dir="$SERVICES_DIR/$service_name"

    if [ ! -d "$target_dir" ]; then
        echo -e "${RED}Service directory '$service_name' not found. Skipping setup.${NC}"
        return 1
    fi

    echo -e "${GREEN}Setting up $service_name...${NC}"

    # Check for package.json (Node.js project)
    if [ -f "$target_dir/package.json" ]; then
        echo "  Installing npm dependencies..."
        (cd "$target_dir" && npm install)
    fi

    # Check for requirements.txt (Python project)
    if [ -f "$target_dir/requirements.txt" ]; then
        echo "  Installing Python dependencies..."
        (cd "$target_dir" && pip install -r requirements.txt)
    fi

    # Check for go.mod (Go project)
    if [ -f "$target_dir/go.mod" ]; then
        echo "  Downloading Go modules..."
        (cd "$target_dir" && go mod download)
    fi

    echo -e "${GREEN}Completed setup for $service_name${NC}"
}

# Clone all services
clone_all() {
    echo -e "${GREEN}Cloning all services...${NC}"

    local services
    services=$(jq -r '.services | keys[]' "$CONFIG_FILE")

    for service in $services; do
        local repo branch
        repo=$(jq -r ".services.\"$service\".repo" "$CONFIG_FILE")
        branch=$(jq -r ".services.\"$service\".branch // \"main\"" "$CONFIG_FILE")

        clone_service "$service" "$repo" "$branch"
    done

    echo -e "${GREEN}All services cloned successfully!${NC}"
}

# Setup all services
setup_all() {
    echo -e "${GREEN}Setting up all services...${NC}"

    local services
    services=$(jq -r '.services | keys[]' "$CONFIG_FILE")

    for service in $services; do
        setup_service "$service"
    done

    echo -e "${GREEN}All services setup complete!${NC}"
}

# List all services
list_services() {
    echo -e "${GREEN}Available services:${NC}"
    echo ""

    local services
    services=$(jq -r '.services | keys[]' "$CONFIG_FILE")

    for service in $services; do
        local name repo port
        name=$(jq -r ".services.\"$service\".name" "$CONFIG_FILE")
        repo=$(jq -r ".services.\"$service\".repo" "$CONFIG_FILE")
        port=$(jq -r ".services.\"$service\".port" "$CONFIG_FILE")

        echo -e "${YELLOW}$service${NC}"
        echo "  Name: $name"
        echo "  Repo: $repo"
        echo "  Port: $port"
        echo ""
    done
}

# Update a single service
update_service() {
    local service_name="$1"
    local target_dir="$SERVICES_DIR/$service_name"

    if [ ! -d "$target_dir" ]; then
        echo -e "${RED}Service directory '$service_name' not found.${NC}"
        return 1
    fi

    echo -e "${GREEN}Updating $service_name...${NC}"
    (cd "$target_dir" && git pull)
    echo -e "${GREEN}Updated $service_name${NC}"
}

# Update all services
update_all() {
    echo -e "${GREEN}Updating all services...${NC}"

    local services
    services=$(jq -r '.services | keys[]' "$CONFIG_FILE")

    for service in $services; do
        update_service "$service"
    done

    echo -e "${GREEN}All services updated!${NC}"
}

# Show help
show_help() {
    echo "Microservices Setup Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  clone     Clone all service repositories"
    echo "  setup     Install dependencies for all services"
    echo "  update    Update all service repositories"
    echo "  list      List all configured services"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 clone    # Clone all services"
    echo "  $0 setup    # Setup dependencies"
    echo "  $0 list     # List all services"
}

# Main script
main() {
    check_jq
    parse_config

    case "${1:-help}" in
        clone)
            clone_all
            ;;
        setup)
            setup_all
            ;;
        update)
            update_all
            ;;
        list)
            list_services
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown command: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
