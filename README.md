# 🍽️ Restaurant Review Platform — Moderation System

**Team XOR · CSCI-275 · Software Engineering**

The **Moderation System** keeps the Restaurant Review Platform safe and trustworthy. Moderators
verify restaurant ownership, scan restaurant data for offensive content, and moderate review
language and media with full undo support.

Built as a monorepo that wires together a React frontend, a NestJS moderation API, and three
independent microservices (user-auth, restaurant, search) from other course teams.

| Area | Stack |
| ---- | ----- |
| Frontend | React 19 · Vite · TanStack Router/Query |
| Moderation API | NestJS · Express · TypeScript |
| Microservices | Node.js · Express · Prisma · PostgreSQL |
| Tooling | pnpm workspace · Vitest · Docker Compose |

---

## 🧑‍🤝‍🧑 Collaborators

All **Team XOR** collaborators are listed in **[collaborators.md](collaborators.md)**.

| #   | Name                | ID     |
| --- | ------------------- | ------ |
| 1   | Amrit Singh         | 814994 |
| 2   | Bhumika             | 817088 |
| 3   | Navreet Kaur        | 816453 |
| 4   | Gustavo Kubo Otsuka | 816171 |
| 5   | Maria Mozammal      | 812270 |

---

## 📚 Documentation

The documentation is split into chunks and indexed in **[docs/README.md](docs/README.md)**:

- **Requirements & design** — [SRS](docs/src/SRS.md) · [Design Document](docs/src/Design_Document.md)
- **Reports** — [Test report](docs/report/test_report.md) · individual final reports
- **Microservices** — user-auth, restaurant, and search setup docs

---

## 🚀 Quick Start

### Option 1 — Docker (recommended, one command)

```bash
docker compose up --build
```

This starts PostgreSQL, all three microservices, the moderation API, and the web app.
Open **http://localhost:5173** and sign in with the seeded root moderator:

- **Email:** `moderator@admin.com`
- **Password:** `moderator123`

| Service          | URL                              |
| ---------------- | -------------------------------- |
| Web app (UI)     | http://localhost:5173            |
| Moderation API   | http://localhost:3000/api        |
| User-auth (API)  | http://localhost:3001            |
| Restaurant (API) | http://localhost:3002            |
| Search (API)     | http://localhost:3003            |
| PostgreSQL       | localhost:5432                   |

### Option 2 — Manual (development)

Install dependencies at the root, then run each piece:

```bash
pnpm install

# 1) Moderation API (http://localhost:3000)
cd apps/backend/moderation-api && pnpm run dev

# 2) Web app (http://localhost:5173, proxies /api to :3000)
cd apps/web/moderation-web && pnpm run dev
```

The microservices are patched copies of the module-team repos under
`apps/backend/moderation-api/services/src/` — see the [services README](apps/backend/moderation-api/services/README.md)
for how to run each one locally (PostgreSQL required).

### Useful commands

```bash
# Tests
cd apps/backend/moderation-api && pnpm run test     # 18 tests
cd apps/web/moderation-web && pnpm run test         # 30 tests

# Quality gates (backend)
pnpm run check-types && pnpm run lint && pnpm run test

# Stop everything / reset the databases (re-runs the demo seed)
docker compose down -v
```

---

## 🐳 Docker

The root [`docker-compose.yml`](docker-compose.yml) describes the whole system:

```text
postgres ──┬─► user-auth (alpha_db)        :3001
           ├─► restaurant (alpha_restaurant):3002   (container :5000)
           └─► search     (alpha_search)   :3003
                  ▲
moderation-web ──► moderation-api ─────────┘
(:5173 / nginx)    (:3000 /api)
```

- Each service runs its own PostgreSQL database (`alpha_db`, `alpha_restaurant`, `alpha_search`),
  created automatically by `docker/postgres-init/01-create-databases.sql` on first boot.
- Port `5000` is reserved by **AirPlay/AirTunes on macOS**, so the restaurant service is published
  as `3002:5000`.
- The web app is served by nginx, which proxies `/api/` to the moderation API.
- Images are built per-service — run `docker compose build` to rebuild after code changes.

---

## 📁 Directory Structure

```text
.
├── README.md                        # This file
├── collaborators.md                 # All module-team contributors
├── docker-compose.yml               # One-command full-stack startup
├── docker/
│   └── postgres-init/               # Creates the per-service databases
├── docs/
│   ├── README.md                    # Documentation hub (links to everything)
│   ├── src/                         # SRS, Design Document, hosting notes, sheets
│   └── report/                      # Test report (.docx) + individual reports
├── apps/
│   ├── backend/
│   │   └── moderation-api/          # NestJS moderation API (the "brain")
│   │       ├── src/                 # auth, restaurant, review, media features
│   │       └── services/            # Microservice bundles
│   │           └── src/
│   │               ├── user-auth/   # Authentication service (404Error)
│   │               ├── restaurant/  # Vendor & restaurant service (BAVY)
│   │               └── search/      # Search service (Oreo McFlurry)
│   └── web/
│       └── moderation-web/          # React frontend (moderator UI)
└── packages/
    ├── contract/                    # Shared DTOs (@contract/moderation)
    └── utils/                       # Shared utilities (@utils/shared)
```

---

## 🧪 Testing

| Suite                     | Count | Command |
| ------------------------- | ----- | ------- |
| Backend unit tests        | 18    | `pnpm run test` in `apps/backend/moderation-api` |
| Frontend unit tests       | 30    | `pnpm run test` in `apps/web/moderation-web` |
| End-to-end (Docker stack) | 13    | covered in the [test report](docs/report/test_report.md) |
