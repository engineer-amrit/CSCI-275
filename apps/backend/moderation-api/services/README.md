# Microservices Directory

This directory contains all external microservices required by the Moderation System.

## Location

This directory is located at `apps/backend/moderation-api/services/` to keep all moderation-related dependencies together.

## Services Overview

| Service | Description | Port |
|---------|-------------|------|
| user-auth | User Authentication Service | 3001 |
| restaurant | Restaurant Management Service | 3002 |
| review | Review Management Service | 3003 |
| media | Media Management Service | 3004 |
| search | Search Service | 3005 |

## Prerequisites

- **jq** (for JSON parsing in scripts)
  - macOS: `brew install jq`
  - Ubuntu: `sudo apt-get install jq`
- **Git**
- **Node.js** (for Node.js services)
- **Python** (for Python services)

## Setup Instructions

### 1. Configure Service Repos

Edit `config.json` to update the repository URLs for each service:

```json
{
  "services": {
    "user-auth": {
      "repo": "https://github.com/your-org/user-auth-service.git"
    }
  }
}
```

### 2. Clone All Services

```bash
./setup.sh clone
```

### 3. Setup Dependencies

```bash
./setup.sh setup
```

### 4. List Services

```bash
./setup.sh list
```

### 5. Update All Services

```bash
./setup.sh update
```

## Service Ports

Each service runs on a unique port to avoid conflicts:

| Service | Port | Database |
|---------|------|----------|
| Moderation API | 3000 | alpha_db |
| User Auth | 3001 | alpha_db |
| Restaurant | 3002 | alpha_db |
| Search | 3003 | alpha_db |

All services share a single PostgreSQL database called `alpha_db`.

## Integration

The Moderation System communicates with these services via HTTP REST APIs. Ensure all services are running when testing the moderation module.

## File Structure

```
apps/backend/moderation-api/services/
├── config.json          # Service configuration
├── setup.sh            # Setup script
├── README.md           # This file
├── docker-compose.yml  # Docker Compose for local development
├── Dockerfile.template # Template for Node.js services
├── user-auth/          # (cloned) User authentication service
├── restaurant/         # (cloned) Restaurant management service
├── review/             # (cloned) Review management service
├── media/              # (cloned) Media management service
└── search/             # (cloned) Search service
```
