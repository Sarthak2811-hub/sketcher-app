# 🎨 Sketcher — Collaborative Whiteboard

**Sketcher** is a premium, real-time collaborative whiteboard and diagramming application. It features a fully infinite drawing canvas with smooth zoom and pan interactions, live multiplayer editing synced over WebSockets, shape creation tools, and dynamic visual grids.

The codebase is organized as a high-performance **Turborepo monorepo** using **Next.js**, **Node.js**, **WebSockets**, and **Prisma**.

---

## ✨ Features

- **Infinite Canvas**: Scroll, pan, and zoom infinitely in any direction.
  - *Panning*: Grab and drag using the **Hand tool**, hold **Spacebar + Left Click**, or drag using the **Middle Mouse Button**.
  - *Zooming*: Magnify up to `2000%` or down to `10%` smoothly relative to your cursor using your scroll wheel or the floating bottom-left controls.
- **Dynamic Dot Grid**: An elegant, tiled grid background that scales and pans natively with zero latency.
- **Multiplayer Collaboration**: Real-time sync of shapes, pencil drawings, texts, and actions using standard WebSockets.
- **Rich Editor Controls**:
  - Draw rectangles, circles, arrows, triangles, and hand-drawn paths (pencil).
  - Erase paths using a custom adjustable eraser brush.
  - Enter, scale, and adjust canvas text overlay elements.
  - Select, drag, and resize existing canvas elements with interactive bounding handles.
- **Export Capabilities**: Clean downloads of current diagrams into PNG, SVG, or JSON formats (Premium tier paywall interface enabled).

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo Manager** | [Turborepo](https://turbo.build/) | Orchestrates builds and package dependencies. |
| **Frontends** | [Next.js](https://nextjs.org/) | Multi-app React frontends (`sketcher-frontend`, `web`, `docs`). |
| **HTTP API** | [Express](https://expressjs.com/) | Powers rooms, authentication, and REST queries. |
| **WebSockets** | [ws](https://github.com/websockets/ws) | Handles real-time client-to-client updates. |
| **Database ORM** | [Prisma](https://www.prisma.io/) | Schema management and type-safe DB client generation. |
| **Database** | PostgreSQL | Local Docker container or cloud database (Neon Cloud). |
| **Containerization** | Docker | Dockerfiles and docker-compose setups. |

---

## 📁 Repository Structure

```
├── apps/
│   ├── sketcher-frontend/   # Main Next.js visual drawing board app (Port 3003)
│   ├── web/                 # Landing site and room directory app (Port 3000)
│   ├── docs/                # Developer guide and docs app (Port 3001)
│   ├── http-backend/        # REST Express server (Port 3002)
│   └── ws-backend/          # WebSocket connection gateway server (Port 8080)
├── packages/
│   ├── db/                  # Shared Prisma ORM client database logic
│   ├── ui/                  # Shared UI component library stub
│   ├── typescript-config/   # Shared typescript tsconfig configs
│   └── eslint-config/       # Lint rules configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v10+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required to run PostgreSQL locally)

### 2. Configure Environment Variables
You need a `.env` file containing the `DATABASE_URL` string in the following locations:
- Root directory (`/`)
- `/packages/db/`
- `/apps/http-backend/`
- `/apps/ws-backend/`

#### To use Neon Cloud Postgres (Default):
```env
DATABASE_URL="postgresql://neondb_owner:...@ep-little-recipe-...neon.tech/neondb?sslmode=require"
```

#### To run PostgreSQL locally in Docker:
```env
DATABASE_URL="postgresql://sketcher:sketcher_password@localhost:5433/sketcherdb"
```

### 3. Initialize & Install Dependencies
Run the installation command in the root directory:
```bash
pnpm install
```

### 4. Setup Database Tables
Sync the Prisma schema to the active database (Neon Cloud or local Docker):
```bash
pnpm --filter=@repo/db run build
npx prisma db push
```

### 5. Start Development Servers
Run the dev task to start frontends, APIs, and WebSockets concurrently:
```bash
pnpm run dev
```

---

## 🐳 Docker Deployment

The application is fully containerized. To run the entire stack inside Docker:

1. **Start local database only** (useful if running apps natively on host):
   ```bash
   docker compose up -d postgres
   ```

2. **Start the entire application stack** (frontend, backend, websockets, database):
   ```bash
   docker compose up --build
   ```
   Open `http://localhost:3003` to start sketching!
