from sqlalchemy import Column, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.database import Base


class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    sale_id = Column(
        Integer,
        ForeignKey("sales.id"),
        nullable=False
    )

    book_id = Column(
        Integer,
        ForeignKey("books.id"),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    price_at_sale = Column(
        Float,
        nullable=False
    )

    sale = relationship(
        "Sale",
        back_populates="items"
    )

    book = relationship(
    "Book",
    back_populates="sale_items"
    )