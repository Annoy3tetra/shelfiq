from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password


def get_user_by_email(db: Session, email: str):

    return db.query(User).filter(
        User.email == email
    ).first()


def create_user(
    db: Session,
    user_data: UserCreate
):

    hashed_password = hash_password(
        user_data.password
    )

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user