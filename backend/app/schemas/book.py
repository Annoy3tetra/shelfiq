from datetime import datetime
from pydantic import BaseModel, Field

from app.enums.book import BookGenre

class BookCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)

    author: str = Field(..., min_length=1, max_length=255)

    isbn: str = Field(..., min_length=10, max_length=20)

    genre: BookGenre

    publisher: str = Field(..., min_length=1, max_length=255)

    price: float = Field(..., gt=0)

    stock_quantity: int = Field(default=0, ge=0)

    reorder_level: int = Field(default=10, ge=0)

    shelf_location: str | None = None
    
class BookResponse(BaseModel):
    id: int

    title: str

    author: str

    isbn: str

    genre: BookGenre

    publisher: str

    price: float

    stock_quantity: int

    reorder_level: int

    shelf_location: str | None

    created_at: datetime

    updated_at: datetime

    class Config:
        from_attributes = True
        
class BookUpdate(BaseModel):
    title: str | None = None

    author: str | None = None

    isbn: str | None = None

    genre: BookGenre | None = None

    publisher: str | None = None

    price: float | None = Field(default=None, gt=0)

    stock_quantity: int | None = Field(default=None, ge=0)

    reorder_level: int | None = Field(default=None, ge=0)

    shelf_location: str | None = None