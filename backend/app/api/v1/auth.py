from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.core.dependencies import get_current_auth, AuthContext
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == req.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    # For development demo fallback
    if not user and req.email == "demo@skarworld.com":
        tenant_query = select(Tenant).limit(1)
        res_t = await db.execute(tenant_query)
        tenant = res_t.scalar_one_or_none()
        if not tenant:
            tenant = Tenant(name="Skarworld HQ", slug="skarworld-hq")
            db.add(tenant)
            await db.flush()
        
        user = User(
            email="demo@skarworld.com",
            name="Alex Rivera",
            hashed_password=get_password_hash("password123"),
            role="admin",
            tenant_id=tenant.id,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(subject=user.id, tenant_id=user.tenant_id, role=user.role)
    refresh_token = create_refresh_token(subject=user.id, tenant_id=user.tenant_id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=60 * 24 * 60,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            tenant_id=user.tenant_id,
            avatar_url=user.avatar_url,
        ),
    )


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    existing = await db.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    # Create new Tenant
    slug = req.company.lower().replace(" ", "-")
    tenant = Tenant(name=req.company, slug=slug)
    db.add(tenant)
    await db.flush()

    # Create Owner User
    user = User(
        email=req.email,
        name=req.name,
        hashed_password=get_password_hash(req.password),
        role="admin",
        tenant_id=tenant.id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(subject=user.id, tenant_id=user.tenant_id, role=user.role)
    refresh_token = create_refresh_token(subject=user.id, tenant_id=user.tenant_id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=60 * 24 * 60,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            tenant_id=user.tenant_id,
            avatar_url=user.avatar_url,
        ),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(auth: AuthContext = Depends(get_current_auth), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == auth.user_id, User.tenant_id == auth.tenant_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        tenant_id=user.tenant_id,
        avatar_url=user.avatar_url,
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(auth: AuthContext = Depends(get_current_auth)):
    return MessageResponse(message="Successfully logged out")
