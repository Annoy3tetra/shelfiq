import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.password_reset import PasswordResetToken
from app.models.user import User


def create_reset_token(db: Session, user_id: int) -> str:
    """
    Generate a secure password-reset token for the given user.

    - Invalidates any previous unused tokens for this user
    - Stores a bcrypt hash of the token (never the raw value)
    - Returns the raw token for inclusion in the email link
    """
    # Invalidate all previous unused tokens for this user
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user_id,
        PasswordResetToken.used == False,
    ).update({"used": True})

    # Generate a cryptographically secure token
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_password(raw_token)

    reset_entry = PasswordResetToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
        used=False,
    )

    db.add(reset_entry)
    db.commit()

    return raw_token


def verify_and_consume_token(db: Session, raw_token: str) -> int | None:
    """
    Verify a raw reset token against stored hashes.

    Returns the user_id if valid, or None if the token
    is invalid, expired, or already used.
    """
    now = datetime.now(timezone.utc)

    # Fetch all unexpired, unused tokens (ordered newest-first for efficiency)
    candidates = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > now,
        )
        .order_by(PasswordResetToken.created_at.desc())
        .limit(50)
        .all()
    )

    for entry in candidates:
        if verify_password(raw_token, entry.token_hash):
            # Mark as used to prevent reuse
            entry.used = True
            db.commit()
            return entry.user_id

    return None


def update_user_password(
    db: Session,
    user_id: int,
    new_password: str,
) -> bool:
    """
    Update a user's password hash.

    Returns True if the user was found and updated, False otherwise.
    """
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return False

    user.password_hash = hash_password(new_password)
    db.commit()

    return True
