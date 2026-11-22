# SKARWORLD REVENUE OS — Security Controls

## Overview

This document describes the security measures implemented in SKARWORLD REVENUE OS to protect business data, customer information, and system integrity.

## Authentication

### Password Security
- Passwords hashed with bcrypt (cost factor 12)
- Minimum 8 characters, requires uppercase and numeric
- Password strength validation on client and server
- Rate-limited login attempts (5 attempts per 15 minutes per IP)

### Token Management
- JWT access tokens with short expiry (30 minutes)
- Refresh token rotation (7-day expiry, single-use)
- Token blacklisting on logout
- Tokens stored in httpOnly cookies (not localStorage)

### Session Security
- Session invalidation on password change
- Concurrent session tracking
- Remote session termination capability

## Authorization

### Role-Based Access Control (RBAC)

| Permission | Super Admin | Business Owner | Admin | Sales Manager | Sales Rep | Analyst |
|---|---|---|---|---|---|---|
| Manage tenants | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage users | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configure AI | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage integrations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve actions | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage leads | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View analytics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View leads | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Tenant Isolation
- All database queries include `tenant_id` filter
- Tenant ID derived from authenticated JWT claims
- PostgreSQL Row-Level Security (RLS) policies as defense-in-depth
- Cross-tenant access automatically blocked at repository layer
- Background jobs scoped to tenant context

## Data Protection

### Input Validation
- Server-side validation with Pydantic schemas
- Client-side validation with Zod schemas
- SQL injection prevention via SQLAlchemy parameterized queries
- XSS prevention via React's default escaping and Content-Security-Policy headers
- File upload validation (type, size, content verification)

### API Security
- CORS whitelist (explicit origin list, no wildcards in production)
- Rate limiting per tenant (configurable)
- Request size limits
- API versioning (/api/v1/)
- Webhook signature verification (HMAC-SHA256)

### Secrets Management
- All secrets stored in Render environment variables
- Integration credentials encrypted at rest (AES-256)
- API keys masked after initial save (never re-displayed)
- No secrets in frontend bundles, logs, or error messages
- .env files excluded from version control

## AI Safety

- AI outputs validated against structured schemas
- No execution of instructions from untrusted content (prompt injection defense)
- AI recommendations clearly separated from authorized actions
- Human approval required for restricted commercial commitments
- AI actions logged with full context (excluding PII in logs)
- Product/pricing information sourced only from verified tenant data
- No fabrication of testimonials, reviews, or payment confirmations

## Communication Security

- WhatsApp webhook signature verification
- SES bounce/complaint handling (automated unsubscribe)
- Telegram webhook verification
- Consent-based messaging (opt-in required)
- Opt-out honored immediately across all channels
- Message deduplication via idempotency keys

## Audit & Compliance

- All sensitive actions logged to audit trail
- Audit logs include: timestamp, user, action, resource, tenant, IP address
- Audit logs immutable (append-only)
- Data retention policies configurable per tenant
- Customer data deletion capability (right to be forgotten)
- Consent records maintained with timestamps

## Infrastructure Security

### Render Deployment
- HTTPS enforced (TLS 1.2+)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP)
- Database connections encrypted in transit
- Redis connections encrypted
- No SSH access to production containers

### Monitoring
- Health check endpoints (/health, /ready)
- Error tracking (structured logging)
- Failed authentication alerts
- Rate limit breach notifications

## Production Checklist

Before deploying to production:

- [ ] All environment variables set in Render
- [ ] SECRET_KEY and JWT_SECRET_KEY are unique, random values
- [ ] CORS_ORIGINS restricted to production domain only
- [ ] Database SSL enforced
- [ ] Rate limiting enabled
- [ ] Webhook secrets configured for all integrations
- [ ] RLS policies enabled on all tenant-scoped tables
- [ ] Audit logging enabled
- [ ] Error reporting configured (no PII in error reports)
- [ ] Security headers verified
- [ ] Dependency vulnerabilities reviewed (npm audit, pip-audit)
