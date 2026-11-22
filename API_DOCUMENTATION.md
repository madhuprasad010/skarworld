# SKARWORLD REVENUE OS — API Documentation

## Overview

The SKARWORLD REVENUE OS API is a RESTful JSON API served by FastAPI. All endpoints are versioned under `/api/v1/`.

**Base URL:** `https://your-domain.com/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### POST /api/v1/auth/login

Login with email and password. Returns access and refresh tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbG...",
  "refresh_token": "eyJhbG...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin",
    "tenant_id": "tnt_xyz789"
  }
}
```

### POST /api/v1/auth/register

Register a new user and organization.

### POST /api/v1/auth/refresh

Refresh an expired access token using a refresh token.

### POST /api/v1/auth/logout

Revoke the current session.

### POST /api/v1/auth/forgot-password

Initiate password reset.

### POST /api/v1/auth/reset-password

Reset password with token.

---

## Standard Response Format

**Success:**
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## Leads

### GET /api/v1/leads

List leads with filtering, sorting, and pagination.

**Query Parameters:**
- `page` (int, default: 1)
- `per_page` (int, default: 20, max: 100)
- `search` (string) — Search name, email, company
- `status` (string) — Filter by status
- `source` (string) — Filter by source
- `industry` (string) — Filter by industry
- `assigned_to` (string) — Filter by assigned user ID
- `sort_by` (string) — Field to sort by
- `sort_order` (string) — asc or desc
- `tags` (string) — Comma-separated tag filter

### GET /api/v1/leads/:id

Get a single lead with full details.

### POST /api/v1/leads

Create a new lead.

### PUT /api/v1/leads/:id

Update a lead.

### DELETE /api/v1/leads/:id

Delete a lead.

### POST /api/v1/leads/bulk

Bulk operations (assign, tag, delete).

### GET /api/v1/leads/export

Export leads as CSV.

---

## Conversations

### GET /api/v1/conversations
### GET /api/v1/conversations/:id
### POST /api/v1/conversations
### POST /api/v1/conversations/:id/messages
### PUT /api/v1/conversations/:id/assign
### PUT /api/v1/conversations/:id/status

---

## Pipeline (Opportunities)

### GET /api/v1/opportunities
### GET /api/v1/opportunities/:id
### POST /api/v1/opportunities
### PUT /api/v1/opportunities/:id
### PATCH /api/v1/opportunities/:id/stage
### DELETE /api/v1/opportunities/:id

---

## Campaigns

### GET /api/v1/campaigns
### GET /api/v1/campaigns/:id
### POST /api/v1/campaigns
### PUT /api/v1/campaigns/:id
### POST /api/v1/campaigns/:id/pause
### POST /api/v1/campaigns/:id/resume
### GET /api/v1/campaigns/:id/analytics

---

## Tasks

### GET /api/v1/tasks
### POST /api/v1/tasks
### PUT /api/v1/tasks/:id
### PATCH /api/v1/tasks/:id/complete
### DELETE /api/v1/tasks/:id

---

## Approvals

### GET /api/v1/approvals
### GET /api/v1/approvals/:id
### POST /api/v1/approvals/:id/decide

---

## Products

### GET /api/v1/products
### GET /api/v1/products/:id
### POST /api/v1/products
### PUT /api/v1/products/:id
### DELETE /api/v1/products/:id

---

## AI Configuration

### GET /api/v1/ai/config
### PUT /api/v1/ai/config
### POST /api/v1/ai/test
### GET /api/v1/ai/knowledge
### POST /api/v1/ai/knowledge/upload
### DELETE /api/v1/ai/knowledge/:id

---

## Integrations

### GET /api/v1/integrations
### PUT /api/v1/integrations/:provider
### POST /api/v1/integrations/:provider/test
### DELETE /api/v1/integrations/:provider

---

## Research

### GET /api/v1/research
### GET /api/v1/research/:id
### POST /api/v1/research/generate
### DELETE /api/v1/research/:id

---

## Analytics

### GET /api/v1/analytics/dashboard
### GET /api/v1/analytics/revenue
### GET /api/v1/analytics/leads
### GET /api/v1/analytics/pipeline
### GET /api/v1/analytics/team
### GET /api/v1/analytics/campaigns
### GET /api/v1/analytics/ai

---

## Settings

### GET /api/v1/settings/profile
### PUT /api/v1/settings/profile
### GET /api/v1/settings/team
### POST /api/v1/settings/team/invite
### PUT /api/v1/settings/team/:user_id/role
### DELETE /api/v1/settings/team/:user_id
### GET /api/v1/settings/audit-log

---

## Webhooks

### POST /api/v1/webhooks/whatsapp
### POST /api/v1/webhooks/telegram
### POST /api/v1/webhooks/ses
### POST /api/v1/webhooks/stripe

All webhooks verify signatures before processing.

---

## Health

### GET /health

Returns 200 if the service is running.

### GET /ready

Returns 200 if the service is ready to handle requests (database connected, etc.).
