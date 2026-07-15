from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    Float,
    Integer,
    String
)
from sqlalchemy.sql import func

from app.db.database import Base
from app.enums.book import BookGenre
from sqlalchemy.orm import relationship


class Book(Base):
    __tablename__ = "books"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    author = Column(
        String,
        nullable=False
    )

    isbn = Column(
        String,
        unique=True,
        nullable=False
    )

    genre = Column(
        Enum(BookGenre),
        nullable=False
    )

    publisher = Column(
        String,
        nullable=False
    )

    price = Column(
        Float,
        nullable=False
    )

    stock_quantity = Column(
        Integer,
        default=0
    )

    reorder_level = Column(
        Integer,
        default=10
    )

    shelf_location = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    
    sale_items = relationship(
    "SaleItem",
    back_populates="book"
    )