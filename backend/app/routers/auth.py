from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate
from app.schemas.user import UserResponse
from app.schemas.auth import LoginRequest
from app.schemas.auth import Token

from app.services.user_service import (
    create_user,
    get_user_by_email
)

from app.core.security import verify_password
from app.core.auth import create_access_token

from app.core.auth import (
    get_current_user,
    get_current_admin
)

from app.models.user import User
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = get_user_by_email(
        db,
        user.email
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return create_user(
        db,
        user
    )


@router.post(
    "/login",
    response_model=Token
)
def login(
    credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = get_user_by_email(
        db,
        credentials.username
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not verify_password(
        credentials.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    
@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@router.get("/admin-only")
def admin_only(
    current_admin: User = Depends(get_current_admin)
):

    return {
        "message": f"Welcome, {current_admin.name}"
    }