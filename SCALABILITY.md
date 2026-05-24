# 📈 Scalability Architecture Guide

This document explains how the **Notes App** can be evolved from a monolithic application into a production-grade, scalable system.

---

## Current Architecture

```
┌─────────────────┐     HTTP      ┌──────────────────────────┐
│  React Frontend │ ──────────── │  Express Monolith (5000)  │
│  (Vite / CDN)   │              │  Auth + Notes + Admin      │
└─────────────────┘              └─────────────┬────────────┘
                                               │ Mongoose
                                      ┌────────▼────────┐
                                      │    MongoDB       │
                                      └─────────────────┘
```

This single-process architecture is **perfectly fine for early-stage projects**. Below are the architectural patterns to adopt as user load grows.

---

## 1. 🧩 Microservices Architecture

Split the monolith into independent services, each with its own database:

```
┌─────────────────┐
│  React Frontend │
│  (Vercel / CDN) │
└────────┬────────┘
         │ HTTPS
┌────────▼────────┐     Internal calls (REST / gRPC)
│   API Gateway   │ ─────────────────────────────────────┐
│ (nginx / Kong)  │                                       │
└────────┬────────┘                                       │
         │                                                │
    ┌────▼──────────┐    ┌─────────────────┐    ┌────────▼────────┐
    │  Auth Service │    │  Notes Service  │    │  Admin Service  │
    │  (port 3001)  │    │  (port 3002)    │    │  (port 3003)    │
    └────┬──────────┘    └────────┬────────┘    └────────┬────────┘
         │                        │                       │
    ┌────▼────┐           ┌───────▼─────┐        ┌───────▼─────┐
    │ Users DB│           │  Notes DB   │        │  Reports DB  │
    │(MongoDB)│           │  (MongoDB)  │        │  (MongoDB)   │
    └─────────┘           └─────────────┘        └─────────────┘
```

### How to split this project:
| Service | Responsibility | Endpoints |
|---|---|---|
| **Auth Service** | Register, login, JWT issuance, profile | `POST /auth/register`, `POST /auth/login`, `GET /auth/profile` |
| **Notes Service** | Notes CRUD, ownership validation | `GET/POST /notes`, `GET/PUT/DELETE /notes/:id` |
| **Admin Service** | User management, audit logs | `GET /admin/users` |

### Key Principle: JWT for inter-service auth
Each service verifies the JWT independently using the shared `JWT_SECRET` — no need for a central auth DB call on every request.

---

## 2. ⚡ Redis Caching

Use Redis to cache frequently-read data and reduce MongoDB load:

```
Request → Check Redis Cache
    ├── CACHE HIT  → Return cached data (< 1ms)
    └── CACHE MISS → Query MongoDB → Store in Redis → Return data
```

### What to cache in this app:

| Data | Cache Key | TTL | Invalidation Trigger |
|---|---|---|---|
| User profile | `user:profile:{userId}` | 10 min | Profile update |
| User's notes list | `notes:user:{userId}` | 2 min | Any CRUD on notes |
| Single note | `note:{noteId}` | 5 min | Note update/delete |
| Admin users list | `admin:users` | 1 min | New user registration |

### Implementation example (with `ioredis`):

```js
// In noteController.js
const redis = require('../config/redis'); // ioredis instance

const getMyNotes = async (req, res, next) => {
  const cacheKey = `notes:user:${req.user._id}`;

  // 1. Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({ success: true, data: JSON.parse(cached), fromCache: true });
  }

  // 2. Cache miss – query DB
  const notes = await Note.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

  // 3. Store in Redis with 2-minute TTL
  await redis.setex(cacheKey, 120, JSON.stringify(notes));

  res.json({ success: true, count: notes.length, data: notes });
};
```

### Redis setup:
```bash
# Install
npm install ioredis

# config/redis.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
module.exports = redis;
```

---

## 3. ⚖️ Load Balancing

When a single server instance can't handle the traffic, run **multiple instances** behind a load balancer:

```
                         ┌─────────────────┐
Clients ───────────────► │  Load Balancer  │
                         │  (nginx / AWS   │
                         │   ALB / HAProxy)│
                         └────────┬────────┘
                    ┌─────────────┼─────────────┐
                    │             │             │
             ┌──────▼───┐  ┌─────▼────┐  ┌────▼─────┐
             │ Node.js  │  │ Node.js  │  │ Node.js  │
             │ Instance │  │ Instance │  │ Instance │
             │ (5000)   │  │ (5001)   │  │ (5002)   │
             └──────────┘  └──────────┘  └──────────┘
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                         ┌────────▼────────┐
                         │    MongoDB      │
                         │ (Replica Set)   │
                         └─────────────────┘
```

### nginx load balancing config:
```nginx
upstream notes_api {
    least_conn;  # Route to least-busy server
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://notes_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Running multiple instances with PM2:
```bash
npm install -g pm2
pm2 start server.js -i 3   # Runs 3 instances using cluster mode
pm2 start server.js -i max # Runs one instance per CPU core
```

> **Important:** When load balancing, session/state must live in Redis (not in-memory), and JWT stateless auth already satisfies this requirement. ✅

---

## 4. 🐳 Docker Deployment

Containerize the application for consistent, reproducible deployments.

### `Dockerfile` (backend):
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5000
USER node

CMD ["node", "server.js"]
```

### `client/Dockerfile` (frontend):
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### `docker-compose.yml` (full stack):
```yaml
version: '3.9'

services:
  mongodb:
    image: mongo:7
    container_name: notes-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: notesapp

  redis:
    image: redis:7-alpine
    container_name: notes-redis
    ports:
      - "6379:6379"

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: notes-backend
    ports:
      - "5000:5000"
    env_file: .env
    environment:
      MONGODB_URI: mongodb://mongodb:27017/notesapp
      REDIS_URL: redis://redis:6379
    depends_on:
      - mongodb
      - redis

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: notes-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

### Running with Docker Compose:
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

---

## 5. 📊 Database Scaling

### MongoDB Replica Set (High Availability)
```
Primary  ──── writes ────────────────────────────►
Secondary ─── reads (distributed) ───────────────►
Secondary ─── reads (distributed) ───────────────►
```

### MongoDB Atlas Scaling
- **M0 (Free)**: Development
- **M10**: Small production workloads
- **M30+**: High traffic with auto-scaling

### Indexes to add for performance:
```js
// In Note.js model
noteSchema.index({ createdBy: 1, createdAt: -1 }); // Notes by user, sorted by date
noteSchema.index({ title: 'text', content: 'text' }); // Full-text search

// In User.js model  
userSchema.index({ email: 1 }); // Already unique – auto-indexed
```

---

## 6. 🔍 Observability

As the system scales, you need visibility:

| Tool | Purpose |
|---|---|
| **Morgan** | HTTP request logging (already added ✅) |
| **Winston** | Structured application logging |
| **Prometheus + Grafana** | Metrics dashboard |
| **Sentry** | Error tracking and alerting |
| **Datadog / New Relic** | Full APM (Application Performance Monitoring) |

---

## Summary: Scaling Roadmap

| Stage | Users | Action |
|---|---|---|
| 🟢 MVP | 0–1K | Current monolith (perfect as-is) |
| 🟡 Growth | 1K–10K | Add Redis caching + PM2 clustering |
| 🟠 Scale | 10K–100K | Load balancer + MongoDB replica set |
| 🔴 Enterprise | 100K+ | Microservices + Kubernetes + CDN |
