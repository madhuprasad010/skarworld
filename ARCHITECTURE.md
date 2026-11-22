# SKARWORLD REVENUE OS — Architecture

## System Overview

SKARWORLD REVENUE OS is a premium, multi-tenant AI-powered sales and revenue automation SaaS platform. It enables businesses to manage their entire sales lifecycle using AI agents, CRM, automated communication, and revenue analytics.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │ Web App  │  │ Widget   │  │ WhatsApp │  │ Telegram Bot │    │
│  │ (React)  │  │ (Chat)   │  │ Cloud API│  │              │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘    │
│       │              │             │               │            │
└───────┼──────────────┼─────────────┼───────────────┼────────────┘
        │              │             │               │
        ▼              ▼             ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (FastAPI)                       │
│  ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │  Auth   │ │  Tenant  │ │   Rate     │ │   CORS / CSRF    │  │
│  │  JWT    │ │  Resolve │ │   Limit    │ │   Protection     │  │
│  └─────────┘ └──────────┘ └────────────┘ └──────────────────┘  │
│                                                                 │
│  /api/v1/auth    /api/v1/leads    /api/v1/conversations         │
│  /api/v1/crm     /api/v1/pipeline /api/v1/campaigns             │
│  /api/v1/tasks   /api/v1/approvals /api/v1/products             │
│  /api/v1/ai      /api/v1/research  /api/v1/analytics            │
│  /api/v1/integrations  /api/v1/settings  /api/v1/webhooks       │
└────────────┬───────────────────────────┬────────────────────────┘
             │                           │
     ┌───────▼────────┐         ┌───────▼─────────┐
     │  PostgreSQL    │         │   Redis          │
     │  (Multi-tenant │         │   (Cache, Queue, │
     │   RLS)         │         │    Sessions)     │
     └────────────────┘         └───────┬──────────┘
                                        │
                                ┌───────▼──────────┐
                                │  Celery Workers   │
                                │  ┌─────────────┐  │
                                │  │ AI Agents   │  │
                                │  │ Research    │  │
                                │  │ Campaigns   │  │
                                │  │ Follow-ups  │  │
                                │  │ Webhooks    │  │
                                │  └─────────────┘  │
                                └──────────────────┘
```

## Frontend Architecture

```
frontend/
├── public/
├── src/
│   ├── app/                    # App entry, providers, router
│   │   ├── App.tsx
│   │   ├── providers.tsx       # QueryClient, Theme, Auth providers
│   │   └── router.tsx          # React Router configuration
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── layout/             # Shell, Sidebar, Header, Breadcrumbs
│   │   ├── data-display/       # Tables, Cards, KPI, Charts
│   │   ├── forms/              # Form fields, validation wrappers
│   │   ├── feedback/           # Loading, Error, Empty states
│   │   └── shared/             # CommandPalette, Search, Notifications
│   │
│   ├── pages/                  # Route-level page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── conversations/
│   │   ├── pipeline/
│   │   ├── campaigns/
│   │   ├── tasks/
│   │   ├── approvals/
│   │   ├── products/
│   │   ├── ai-config/
│   │   ├── integrations/
│   │   ├── research/
│   │   ├── analytics/
│   │   └── settings/
│   │
│   ├── services/               # API client and service layer
│   │   ├── api-client.ts       # Typed HTTP client (fetch/axios)
│   │   ├── auth.service.ts
│   │   ├── leads.service.ts
│   │   ├── conversations.service.ts
│   │   ├── pipeline.service.ts
│   │   └── ...
│   │
│   ├── mock/                   # Centralized mock data
│   │   ├── data/               # Mock datasets
│   │   ├── handlers.ts         # Mock service implementations
│   │   └── index.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores (auth, ui, etc.)
│   ├── types/                  # TypeScript type definitions
│   ├── lib/                    # Utility functions
│   ├── schemas/                # Zod validation schemas
│   └── styles/                 # Global styles, design tokens
│
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Backend Architecture

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── leads.py
│   │       ├── conversations.py
│   │       ├── pipeline.py
│   │       ├── campaigns.py
│   │       ├── tasks.py
│   │       ├── approvals.py
│   │       ├── products.py
│   │       ├── ai_config.py
│   │       ├── integrations.py
│   │       ├── research.py
│   │       ├── analytics.py
│   │       └── settings.py
│   │
│   ├── core/
│   │   ├── config.py           # Environment configuration
│   │   ├── security.py         # JWT, password hashing
│   │   ├── database.py         # SQLAlchemy engine, session
│   │   └── dependencies.py     # FastAPI dependencies
│   │
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── tenant.py
│   │   ├── user.py
│   │   ├── lead.py
│   │   ├── conversation.py
│   │   └── ...
│   │
│   ├── schemas/                # Pydantic request/response schemas
│   ├── services/               # Business logic layer
│   ├── repositories/           # Data access layer
│   ├── agents/                 # AI agent modules
│   │   ├── base.py
│   │   ├── research.py
│   │   ├── qualification.py
│   │   ├── scoring.py
│   │   ├── conversation.py
│   │   ├── proposal.py
│   │   └── ...
│   │
│   ├── integrations/           # External service adapters
│   │   ├── whatsapp.py
│   │   ├── ses.py
│   │   ├── telegram.py
│   │   ├── tavily.py
│   │   └── brave.py
│   │
│   ├── workers/                # Celery task definitions
│   ├── tasks/                  # Scheduled tasks
│   ├── middleware/              # Custom middleware
│   ├── security/               # Auth guards, RLS
│   └── utils/                  # Shared utilities
│
├── migrations/                 # Alembic migrations
├── tests/
├── alembic.ini
├── requirements.txt
└── Dockerfile
```

## Database Architecture

### Multi-Tenancy Strategy

- **Shared database, shared schema** with `tenant_id` column on every table
- PostgreSQL Row-Level Security (RLS) policies as defense-in-depth
- Application-level tenant filtering in repositories
- Tenant ID derived from authenticated JWT, never from request params

### Core Tables

- `tenants` — Business/organization accounts
- `users` — Users with tenant association and roles
- `leads` — Lead/prospect records
- `conversations` — Multi-channel conversations
- `messages` — Individual messages in conversations
- `opportunities` — Sales pipeline opportunities
- `campaigns` — Marketing/sales campaigns
- `tasks` — Follow-up tasks
- `approvals` — Approval requests and decisions
- `products` — Product/service catalog
- `ai_configs` — Tenant-specific AI configuration
- `integrations` — Integration credentials (encrypted)
- `research_reports` — AI research results
- `audit_logs` — Security and action audit trail

## AI Integration Architecture

### Provider Abstraction

```python
class AIProvider(ABC):
    async def complete(self, messages, tools, config) -> AIResponse: ...
    async def stream(self, messages, tools, config) -> AsyncIterator: ...

class ClaudeProvider(AIProvider):
    # Anthropic Claude API implementation

class AIProviderFactory:
    @staticmethod
    def create(provider: str, config: dict) -> AIProvider: ...
```

### Agent Modules

Each AI agent module is independently configurable per tenant:
- Market Research Agent
- Prospect Research Agent  
- Lead Qualification Agent
- Lead Scoring Agent
- Sales Conversation Agent
- Objection Handling Agent
- Proposal Generation Agent
- Payment Verification Agent

## Deployment Architecture (Render)

| Service | Type | Purpose |
|---------|------|---------|
| `skarworld-frontend` | Web Service | React SPA (Vite build) |
| `skarworld-api` | Web Service | FastAPI application |
| `skarworld-db` | PostgreSQL | Primary database |
| `skarworld-redis` | Key-Value | Cache, Celery broker |
| `skarworld-worker` | Background Worker | Celery worker |
| `skarworld-scheduler` | Cron Job | Celery Beat scheduler |

## Security Model

- JWT access tokens (short-lived) + refresh token rotation
- bcrypt password hashing
- Role-based access control (RBAC)
- Tenant-scoped authorization on every endpoint
- Input validation (Pydantic + Zod)
- CORS whitelist
- Rate limiting per tenant
- Webhook signature verification (HMAC)
- Encrypted credential storage for integrations
- Audit logging for all sensitive operations
