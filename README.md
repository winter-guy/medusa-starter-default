<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2 of `@medusajs/medusa`. 

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.


## Quick Start / Cheat Sheet

**Local Development**
```bash
# Install
yarn install

# Disable Telemetry (Optional)
npx medusa telemetry --disable

# Start (Migrations + Server)
./start.sh

# Start with Fresh Data (Migrations + Seed + Server)
./start.sh seed
```

**Docker Development**
```bash
# Start all services
yarn docker:up

# Stop all services
yarn docker:down

# View logs
docker compose logs -f medusa
```

---

## Prerequisites

Ensure you have the following tools installed on your system:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/en/) | v20+ | JavaScript Runtime |
| [Yarn](https://yarnpkg.com/) | Latest | Package Manager |
| [PostgreSQL](https://www.postgresql.org/) | v14+ | Primary Database |
| [Redis](https://redis.io/) | v7+ | Event Queue & Cache |
| [Docker](https://www.docker.com/) | Latest | Containerization (Optional) |

---

## Local Setup Guide

Follow these steps to set up the project locally.

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd medusa-store
yarn install
```

### 2. Configuration

Copy the template environment file to create your local config:

```bash
cp .env.template .env
```

**Critical `.env` Variables:**

- `DATABASE_URL`: `postgres://user:password@localhost:5432/medusa-store`
  - *Ensure this matches your local Postgres credentials.*
- `REDIS_URL`: `redis://localhost:6379`
- `STORE_CORS`: URLs allowed to access the Store API (e.g., `http://localhost:8000`).
- `ADMIN_CORS`: URLs allowed to access the Admin API (e.g., `http://localhost:7000`).
- `JWT_SECRET` / `COOKIE_SECRET`: Change these for production!

**Telemetry:**
If you wish to disable data collection, run:
```bash
npx medusa telemetry --disable
```

### 3. Database Setup

Ensure your PostgreSQL service is running and execute the following:

**Option A: Using the Convenience Script (Recommended)**

We have provided `start.sh` to automate migrations and usage.

```bash
# Standard Start: Runs migrations -> Starts Dev Server
./start.sh

# Fresh Start: Runs migrations -> Seeds Data -> Starts Dev Server
# WARNING: 'yarn seed' may conflict with existing data. Use only on fresh DBs.
./start.sh seed
```

**Option B: Manual Setup**

```bash
# 1. Run Migrations (Creates tables)
npx medusa db:migrate

# 2. Seed Database (Optional - Populates initial data)
yarn seed

# 3. Create Admin User (If not seeding)
npx medusa user:invite --email admin@medusa-test.com

# 4. Start Server
yarn dev
```

---

## 🐳 Docker Setup Guide

Run the entire application stack (Postgres + Redis + Medusa) using Docker.

### 1. Build and Start

We have configured helpful scripts in `package.json` for Docker management.

```bash
# Start Docker containers (builds if necessary)
yarn docker:up
```

This acts as a shortcut for `docker compose up --build -d`. It will:
1. Spin up `postgres` and `redis` containers.
2. Build the `medusa` image from the `Dockerfile`.
3. Start the Medusa server on port `9000`.

### 2. Useful Docker Commands

| Action | Command |
|--------|---------|
| **Start** | `yarn docker:up` |
| **Stop** | `yarn docker:down` |
| **View Logs** | `docker compose logs -f medusa` |
| **Restart Server** | `docker compose restart medusa` |
| **Clean Start** | `docker compose down -v && yarn docker:up` (Deletes DB volume!) |
| **Enter Container** | `docker compose exec medusa sh` |

### 3. Docker Troubleshooting

- **Container Exits Immediately**: Check logs with `docker compose logs medusa`. Often due to DB connection failure.
- **DB Connection Error**: Ensure `DATABASE_URL` in `.env` uses the service name `postgres` (e.g., `postgres://postgres:postgres@postgres:5432/medusa-store`) instead of `localhost`.

---

## Project Structure

A high-level overview of the `src` directory:

```
src/
├── admin/          # Medusa Admin UI customizations
│   ├── widgets/    # Custom widgets (e.g., Branding)
│   └── i18n/       # Internationalization files
├── api/            # Custom API Endpoints
├── jobs/           # Scheduled CRON jobs
├── modules/        # Custom Medusa Modules
│   └── payment-phonepe/ # PhonePe Payment Provider
├── scripts/        # Utility scripts (e.g., seed.ts)
├── subscribers/    # Event listeners
└── workflows/      # Medusa Workflows
```

---

## Troubleshooting & Common Errors

### 1. "Connection refused" to Database
- **Cause**: Postgres is not running or credentials in `.env` are wrong.
- **Fix**:
  - Run `brew services list` (MacOS) or `sudo systemctl status postgresql` (Linux) to check status.
  - Verify `DATABASE_URL` matches your local config.

### 2. "Redis connection failed"
- **Cause**: Redis is not running.
- **Fix**: Ensure Redis is started (`redis-server`). If using Docker, ensure the `redis` service is up.

### 3. Migration Failures
- **Cause**: Database is not accessible or in an inconsistent state.
- **Fix**:
  - Check credentials.
  - Drop the database and recreate it if it's a dev environment: `dropdb medusa-store && createdb medusa-store`.

### 4. `EADDRINUSE` (Port 9000 taken)
- **Cause**: Another instance of Medusa is running.
- **Fix**: Kill the process using `lsof -i :9000` to find the PID, then `kill -9 <PID>`.

---

## Resources & Documentation

### Configuration & Setup
- [Medusa Configuration Guide](https://docs.medusajs.com/learn/fundamentals/config) - Learn about `medusa-config.ts`.
- [Installation Guide](https://docs.medusajs.com/learn/installation) - Official installation steps.
- [Database Setup (PostgreSQL)](https://docs.medusajs.com/learn/fundamentals/config/database) - detailed database configuration.
- [Redis Configuration](https://docs.medusajs.com/learn/fundamentals/config/redis) - Setup events and caching.
- [Environment Variables](https://docs.medusajs.com/learn/fundamentals/environment-variables) - Managing environments.

### Development
- [Medusa Admin Extension](https://docs.medusajs.com/learn/fundamentals/admin/widgets) - How to create custom widgets.
- [API Reference](https://docs.medusajs.com/api/store) - Complete Store & Admin API reference.
- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows) - Building custom workflows.

### Modules & Plugins
- [Commerce Modules](https://docs.medusajs.com/learn/fundamentals/modules) - Understanding the module system.
- [Payment Module Docs](https://docs.medusajs.com/resources/commerce-modules/payment) - Payment provider integration details.
- [S3 File Storage](https://docs.medusajs.com/resources/infrastructure-modules/file/s3) - Setting up AWS S3 for file storage.

### Deployment
- [Deployment Guide](https://docs.medusajs.com/learn/deployment) - General deployment strategies.
- [Docker Deployment](https://docs.medusajs.com/learn/installation/docker) - Official Docker guide.
- [AWS EC2 & Supabase Guide](https://medium.com/@fatimamujahid01/step-by-step-guide-to-deploy-medusajs-on-aws-ec2-and-supabase-b184f0e4fbd5) - Step-by-step community guide for deploying Medusa on AWS EC2 with Supabase.

### Community
- [Discord Community](https://discord.gg/medusajs) - Get help from the community.
- [GitHub Repository](https://github.com/medusajs/medusa) - Core framework code.
