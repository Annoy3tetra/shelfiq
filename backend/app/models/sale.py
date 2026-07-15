from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Sale(Base):
    __tablename__ = "sales"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    employee_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    total_amount = Column(
        Float,
        nullable=False
    )

    sale_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    employee = relationship(
    "User",
    back_populates="sales"
    )

    items = relationship(
        "SaleItem",
        back_populates="sale",
        cascade="all, delete-orphan"
    )