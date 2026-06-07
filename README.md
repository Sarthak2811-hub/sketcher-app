# 🎨 Sketcher — Real-Time Collaborative Whiteboard

**Sketcher** is a premium, real-time collaborative whiteboard and diagramming tool. Draw together with others on a fully infinite canvas with smooth zoom and pan, live WebSocket sync, rich shape tools, undo/redo, and one-click room sharing.

The codebase is a high-performance **Turborepo monorepo** built with **Next.js**, **Node.js**, **WebSockets**, and **Prisma ORM**.

---

## ✨ Features

### 🖼️ Infinite Canvas
- **Pan**: Drag with the **Hand tool**, hold **Spacebar + Left Click**, or use the **Middle Mouse Button**.
- **Zoom**: Scroll wheel or bottom-left zoom controls — smoothly scales from `10%` to `2000%` relative to your cursor position.
- **Dynamic Dot Grid**: Tiled dot grid that scales and pans natively with zero latency.
- **Reset View**: One-click recenter button in the bottom-left controls.

### 🎨 Drawing Tools
| Tool | Description |
| :--- | :--- |
| ✏️ Pencil | Freehand drawing with smooth strokes |
| ▭ Rectangle | Draw axis-aligned rectangles |
| ○ Circle | Draw circles from center point |
| → Arrow | Draw directional arrows with arrowheads |
| △ Triangle | Draw filled outline triangles |
| T Text | Place and edit text labels on the canvas |
| ◌ Eraser | Custom adjustable eraser brush |
| ↖ Select | Select, drag, and resize any shape with bounding handles |
| ✋ Pan | Hand tool to pan the canvas |

### 🎨 Styling
- **8 colors**: White, Red, Orange, Yellow, Green, Blue, Purple, Pink
- **4 stroke sizes**: Thin (2px), Medium (6px), Thick (12px), Extra Thick (20px)

### 👥 Multiplayer Collaboration
- Real-time sync of all drawing actions over standard **WebSockets**
- Each room is isolated — only users in the same room share a canvas
- **Share Room**: One-click share button (🔗) copies the room URL to clipboard

### ↩️ History
- **Undo**: Reverse your last drawn shape
- **Redo**: Re-apply a reversed action

### 📤 Export (Premium)
- Export the current canvas as **PNG**, **SVG**, or **JSON**
- Premium paywall interface included

### 🖥️ Redesigned User Interface & Landing Hubs
- **Lobby Landing Page (Port 3000)**: Completely redesigned with a premium dark-mode aesthetic, glowing background shaders, and floating animated hand-drawn SVGs. Single-action Room ID entering directly redirects to the main drawing canvas. Includes a dynamic, collapsible monorepo architecture info box.
- **Frontend App Features Grid (Port 3003)**: Features a beautiful 3-column flagship grid displaying six major project features (Infinite Canvas, Real-Time Collaboration, One-Click Sharing, Freehand Drawing, Export Options, and Blazing Fast performance) with customized Lucide icons.
- **Clean Layout**: Cleaned up the landing footer layout by removing unused placeholder links (Terms, Privacy, Blog, Changelog, Twitter) to focus on the project's single source of truth.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo** | [Turborepo](https://turbo.build/) | Orchestrates builds, caching, and package dependencies |
| **Frontend** | [Next.js 15+](https://nextjs.org/) | `sketcher-frontend`, `web`, `docs` apps |
| **HTTP API** | [Express](https://expressjs.com/) | Room creation, auth (signup/signin), REST endpoints |
| **Real-Time** | [ws](https://github.com/websockets/ws) | WebSocket server for live collaborative updates |
| **Auth** | [JWT](https://jwt.io/) | JSON Web Token based authentication |
| **ORM** | [Prisma](https://www.prisma.io/) | Type-safe database client and schema migrations |
| **Database** | PostgreSQL | Neon Cloud (default) or local Docker |
| **Containers** | Docker + Compose | Full stack containerization |

---

## 📁 Repository Structure

```
sketcher-app/
├── apps/
│   ├── sketcher-frontend/   # Main drawing canvas app       → Port 3003
│   ├── web/                 # Landing page & room lobby     → Port 3000
│   ├── docs/                # Developer documentation       → Port 3001
│   ├── http-backend/        # REST API (rooms, auth)        → Port 3002
│   └── ws-backend/          # WebSocket gateway server      → Port 8080
├── packages/
│   ├── db/                  # Prisma schema + shared DB client
│   ├── ui/                  # Shared UI components
│   ├── typescript-config/   # Shared tsconfig settings
│   └── eslint-config/       # Shared lint rules
├── docker-compose.yml       # Full stack Docker orchestration
└── turbo.json               # Turborepo pipeline config
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v10+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(only if using local PostgreSQL)*

### 1. Clone the Repository
```bash
git clone https://github.com/Sarthak2811-hub/sketcher-app.git
cd sketcher-app
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables

Create `.env` files with `DATABASE_URL` in these locations:
- `/` (root)
- `/packages/db/`
- `/apps/http-backend/`
- `/apps/ws-backend/`

**Option A — Neon Cloud Postgres (recommended, no Docker needed):**
```env
DATABASE_URL="postgresql://neondb_owner:<password>@<host>.neon.tech/neondb?sslmode=require"
```

**Option B — Local Docker Postgres:**
```env
DATABASE_URL="postgresql://sketcher:sketcher_password@localhost:5433/sketcherdb"
```
Then start the database container:
```bash
docker compose up -d postgres
```

### 4. Sync Database Schema
```bash
cd packages/db
npx prisma db push
cd ../..
```

### 5. Run Development Servers
```bash
pnpm run dev
```

| App | URL |
| :--- | :--- |
| 🎨 Sketcher Canvas | http://localhost:3003 |
| 🌐 Web / Lobby | http://localhost:3000 |
| 📖 Docs | http://localhost:3001 |
| ⚙️ HTTP API | http://localhost:3002 |
| 🔌 WebSocket | ws://localhost:8080 |

---

## 🏭 Production Build

Build all apps:
```bash
pnpm run build
```

Start production servers:
```bash
pnpm run start
```

---

## 🐳 Docker Deployment

Run the entire stack (frontend + backends + database) in containers:

```bash
docker compose up --build
```

Open **http://localhost:3003** to start sketching!

To run only the database container (and run apps natively):
```bash
docker compose up -d postgres
```

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user account |
| `POST` | `/signin` | Authenticate and receive a JWT token |
| `POST` | `/room` | Create a new collaborative room |
| `GET` | `/room/:slug` | Fetch room details by slug |
| `GET` | `/chats/:roomId` | Fetch all persisted shapes for a room |

---

## 🔌 WebSocket Events

| Event | Direction | Description |
| :--- | :--- | :--- |
| `join` | Client → Server | Join a room by roomId |
| `draw` | Client → Server | Broadcast a new shape to all room members |
| `delete_shape` | Client → Server | Broadcast a shape deletion (undo) |
| `clear` | Client → Server | Clear all shapes in the room |
| `draw` | Server → Client | Receive a new shape from another user |

---

## 🗂️ Database Schema

```prisma
model User  { id, email, password, name, rooms[] }
model Room  { id, slug, adminId, createdAt, messages[] }
model Chat  { id, roomId, userId, message, createdAt }
```


