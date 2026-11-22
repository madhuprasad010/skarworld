# SKARWORLD REVENUE OS

Premium multi-tenant AI-powered sales and revenue automation platform.

## Overview

SKARWORLD REVENUE OS transforms traditional sales processes into AI-assisted revenue operations. It enables businesses across industries to manage their complete sales lifecycle using AI agents, automated communication, CRM, and revenue analytics.

## Technology Stack

### Frontend
- **React 19** + TypeScript
- **Vite** — Build tooling
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Component primitives
- **React Router** — Client-side routing
- **TanStack Query** — Server state management
- **React Hook Form** + **Zod** — Form handling and validation
- **Recharts** — Data visualization
- **Zustand** — Client state management
- **Lucide React** — Icon library
- **date-fns** — Date utilities

### Backend (Phase 6+)
- **Python 3.12** + FastAPI
- **SQLAlchemy 2.x** + Alembic
- **PostgreSQL** — Primary database
- **Redis** — Cache and message broker
- **Celery** + Celery Beat — Background workers

### AI
- **Anthropic Claude API** — AI agent engine

### Deployment
- **Render** — Cloud hosting (Web, DB, Redis, Workers)

## Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Python >= 3.12 (for backend phases)
- PostgreSQL 16 (for backend phases)
- Redis (for backend phases)

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd skarworld-revenue-os

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
skarworld-revenue-os/
├── frontend/           # React + TypeScript SPA
├── backend/            # FastAPI application (Phase 6+)
├── widget/             # Embeddable chat widget (Phase 9+)
├── docs/               # Additional documentation
├── scripts/            # Utility and deployment scripts
├── tests/              # Integration and E2E tests
├── render.yaml         # Render deployment blueprint
├── BUILD_STATUS.md     # Current build progress
├── ARCHITECTURE.md     # System architecture
├── SECURITY.md         # Security controls
├── .env.example        # Environment variable template
└── README.md           # This file
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

See `.env.example` for all required variables with descriptions.

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run linter
npm run type-check   # TypeScript check
```

### Backend Development (Phase 6+)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

## Testing

```bash
# Frontend
cd frontend && npm test

# Backend (Phase 6+)
cd backend && pytest
```

## Deployment

This application is designed for deployment on Render. See `render.yaml` for the deployment blueprint.

**Do not deploy paid infrastructure without explicit approval.**

## Documentation

- [Architecture](./ARCHITECTURE.md)
- [Build Status](./BUILD_STATUS.md)
- [Security](./SECURITY.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## License

Proprietary — All rights reserved.
