from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import Depends

from app.db.session import get_db


router = APIRouter(
    prefix="/test",
    tags=["Test"]
)


@router.get("/")
def test_database(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))

    return {
        "message": "Database connected successfully"
    }