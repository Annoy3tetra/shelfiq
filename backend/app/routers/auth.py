from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate
from app.schemas.user import UserResponse
from app.schemas.auth import (
    LoginRequest,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
)

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

from app.services.password_reset_service import (
    create_reset_token,
    verify_and_consume_token,
    update_user_password,
)
from app.services.email_service import send_password_reset_email


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
        "role": current_user.role,
        "profile_image_url": current_user.profile_image_url
    }


@router.get("/admin-only")
def admin_only(
    current_admin: User = Depends(get_current_admin)
):

    return {
        "message": f"Welcome, {current_admin.name}"
    }


# ── Password Reset Endpoints ─────────────────────────────────


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
)
def forgot_password(
    body: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Request a password reset email.

    Always returns a success message regardless of whether
    the email exists — this prevents email enumeration attacks.
    """
    user = get_user_by_email(db, body.email)

    if user:
        raw_token = create_reset_token(db, user.id)
        send_password_reset_email(user.email, raw_token)

    # Identical response whether or not the email was found
    return {
        "message": (
            "If an account with that email exists, "
            "a password reset link has been sent."
        )
    }


@router.post(
    "/reset-password",
    response_model=MessageResponse,
)
def reset_password(
    body: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Consume a reset token and set a new password.

    Returns 400 if the token is invalid, expired, or already used.
    """
    user_id = verify_and_consume_token(db, body.token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    update_user_password(db, user_id, body.new_password)

    return {
        "message": "Your password has been reset successfully."
    }