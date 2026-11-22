from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.auth import router as auth_router
from app.api.v1.leads import router as leads_router
from app.api.v1.pipeline import router as pipeline_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.approvals import router as approvals_router
from app.api.v1.products import router as products_router
from app.api.v1.conversations import router as conversations_router
from app.api.v1.campaigns import router as campaigns_router
from app.api.v1.ai import router as ai_router
from app.api.v1.integrations import router as integrations_router
from app.api.v1.research import router as research_router
from app.api.v1.settings import router as settings_router
from app.api.v1.webhooks import router as webhooks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health & Readiness endpoints (required for Render)
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "skarworld-api", "version": "1.0.0"}


@app.get("/ready", tags=["Health"])
async def readiness_check():
    return {"status": "ready"}


# Register API v1 Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(leads_router, prefix=settings.API_V1_PREFIX)
app.include_router(pipeline_router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics_router, prefix=settings.API_V1_PREFIX)
app.include_router(tasks_router, prefix=settings.API_V1_PREFIX)
app.include_router(approvals_router, prefix=settings.API_V1_PREFIX)
app.include_router(products_router, prefix=settings.API_V1_PREFIX)
app.include_router(conversations_router, prefix=settings.API_V1_PREFIX)
app.include_router(campaigns_router, prefix=settings.API_V1_PREFIX)
app.include_router(ai_router, prefix=settings.API_V1_PREFIX)
app.include_router(integrations_router, prefix=settings.API_V1_PREFIX)
app.include_router(research_router, prefix=settings.API_V1_PREFIX)
app.include_router(settings_router, prefix=settings.API_V1_PREFIX)
app.include_router(webhooks_router, prefix=settings.API_V1_PREFIX)
