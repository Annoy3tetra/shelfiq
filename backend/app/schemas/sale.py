from datetime import datetime
from pydantic import BaseModel


class SaleItemCreate(BaseModel):
    book_id: int
    quantity: int


class SaleCreate(BaseModel):
    items: list[SaleItemCreate]


class SaleItemResponse(BaseModel):
    id: int
    book_id: int
    quantity: int
    price_at_sale: float

    class Config:
        from_attributes = True


class SaleResponse(BaseModel):
    id: int
    employee_id: int
    total_amount: float
    sale_date: datetime
    items: list[SaleItemResponse]

    class Config:
        from_attributes = True