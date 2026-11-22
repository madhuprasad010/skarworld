# SKARWORLD REVENUE OS — Troubleshooting

## Common Development Issues

### Frontend won't start

**Symptom:** `npm run dev` fails or shows blank page.

**Solutions:**
1. Ensure Node.js >= 20.x is installed: `node --version`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Check that all environment variables are set in `.env.development`

### TypeScript errors after pulling changes

**Symptom:** TypeScript compilation errors on `npm run build`.

**Solutions:**
1. Run `npm run type-check` to see specific errors
2. Ensure `@/` path alias is correctly configured in `tsconfig.json`
3. Check that new type definitions are exported from `@/types`

### Tailwind styles not applying

**Symptom:** Components render without styles.

**Solutions:**
1. Verify `globals.css` is imported in `main.tsx`
2. Check `tailwind.config.ts` content paths include `./src/**/*.{ts,tsx}`
3. Restart the dev server after config changes
4. Check the browser console for CSS loading errors

### Charts not rendering

**Symptom:** Recharts components show blank areas.

**Solutions:**
1. Ensure the chart container has explicit height (Recharts requires this)
2. Wrap charts in `ResponsiveContainer` with `width="100%" height={300}`
3. Verify mock data arrays are not empty
4. Check that data key names match between data array and chart components

### API proxy not working in development

**Symptom:** API calls return 404 or CORS errors.

**Solutions:**
1. Check `vite.config.ts` proxy configuration
2. Ensure the backend is running on the configured port (default: 8000)
3. Verify `VITE_API_BASE_URL` in `.env.development`
4. In development mode, the app uses mock data — API proxy is only needed when connecting to real backend

## Backend Issues (Phase 6+)

### Database connection fails

**Solutions:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check `DATABASE_URL` format: `postgresql+asyncpg://user:pass@host:port/dbname`
3. Ensure the database exists: `createdb skarworld`

### Alembic migration errors

**Solutions:**
1. Check migration history: `alembic history`
2. Verify current revision: `alembic current`
3. For conflicts, create a merge migration: `alembic merge heads`
4. Never manually edit migration files after they've been applied

### Celery workers not processing tasks

**Solutions:**
1. Verify Redis is running: `redis-cli ping`
2. Check `REDIS_URL` configuration
3. Ensure the worker is started: `celery -A app.workers.celery_app worker --loglevel=info`
4. Check the Celery log for connection errors

### JWT authentication failures

**Solutions:**
1. Verify `JWT_SECRET_KEY` is set and consistent across services
2. Check token expiry — access tokens expire in 30 minutes
3. Ensure the Authorization header format: `Bearer <token>`
4. Check clock synchronization between services

## Deployment Issues

### Render build fails

**Solutions:**
1. Check build logs in the Render dashboard
2. Verify `render.yaml` syntax
3. Ensure all required environment variables are set
4. For frontend: verify `npm run build` succeeds locally
5. For backend: verify `pip install -r requirements.txt` succeeds locally

### Health check failing on Render

**Solutions:**
1. Verify the `/health` endpoint returns 200
2. Check that the app binds to `0.0.0.0` and uses `$PORT`
3. Increase health check timeout in Render settings
4. Check application logs for startup errors

### CORS errors in production

**Solutions:**
1. Verify `CORS_ORIGINS` includes the exact frontend URL (with https://)
2. Do not use wildcard `*` in production
3. Check that preflight OPTIONS requests are handled

## Getting Help

1. Check the application logs for detailed error messages
2. Review the architecture documentation in `ARCHITECTURE.md`
3. Check the security documentation in `SECURITY.md`
4. For deployment issues, consult the Render documentation
