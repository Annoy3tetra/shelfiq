from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User
from app.models.book import Book

from app.schemas.book import (
    BookCreate,
    BookResponse,
    BookUpdate
)

from app.services.book_service import (
    create_book,
    delete_book,
    get_all_books,
    get_book_by_id,
    get_book_by_isbn,
    update_book
)

from app.core.auth import (
    get_current_admin,
    get_current_user
)

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

@router.post(
    "/",
    response_model=BookResponse
)
def create_new_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    existing_book = get_book_by_isbn(
        db,
        book.isbn
    )

    if existing_book:

        raise HTTPException(
            status_code=400,
            detail="ISBN already exists"
        )

    return create_book(
        db,
        book
    )
    
@router.get(
    "/",
    response_model=list[BookResponse]
)
def fetch_books(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if page < 1:

        raise HTTPException(
            status_code=400,
            detail="Page must be greater than 0"
        )

    if limit < 1 or limit > 100:

        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100"
        )

    skip = (page - 1) * limit

    books = db.query(Book).offset(skip).limit(limit).all()

    return books

@router.get(
    "/{book_id}",
    response_model=BookResponse
)
def fetch_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    book = get_book_by_id(
        db,
        book_id
    )

    if not book:

        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return book

@router.put(
    "/{book_id}",
    response_model=BookResponse
)
def edit_book(
    book_id: int,
    book_data: BookUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    book = get_book_by_id(
        db,
        book_id
    )

    if not book:

        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return update_book(
        db,
        book,
        book_data
    )
    
@router.delete(
    "/{book_id}"
)
def remove_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    book = get_book_by_id(
        db,
        book_id
    )

    if not book:

        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    delete_book(
        db,
        book
    )

    return {
        "message": "Book deleted successfully"
    }