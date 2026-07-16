from sqlalchemy.orm import Session

from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate


def get_book_by_id(db: Session, book_id: int, user_id: int):
    return db.query(Book).filter(
        Book.id == book_id,
        Book.user_id == user_id
    ).first()


def get_book_by_isbn(db: Session, isbn: str, user_id: int):
    return db.query(Book).filter(
        Book.isbn == isbn,
        Book.user_id == user_id
    ).first()


def get_all_books(db: Session, user_id: int):
    return db.query(Book).filter(
        Book.user_id == user_id
    ).all()


def create_book(
    db: Session,
    book_data: BookCreate,
    user_id: int
):
    book = Book(
        title=book_data.title,
        author=book_data.author,
        isbn=book_data.isbn,
        genre=book_data.genre,
        publisher=book_data.publisher,
        price=book_data.price,
        stock_quantity=book_data.stock_quantity,
        reorder_level=book_data.reorder_level,
        shelf_location=book_data.shelf_location,
        user_id=user_id
    )

    db.add(book)
    db.commit()
    db.refresh(book)

    return book


def update_book(
    db: Session,
    book: Book,
    book_data: BookUpdate
):
    update_data = book_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(book, key, value)

    db.commit()
    db.refresh(book)

    return book


def delete_book(
    db: Session,
    book: Book
):
    db.delete(book)
    db.commit()