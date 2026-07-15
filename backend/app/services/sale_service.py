from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.book import Book
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.schemas.sale import SaleCreate


def create_sale(
    db: Session,
    sale_data: SaleCreate,
    employee_id: int
):

    total_amount = 0
    sale_items = []

    try:

        for item in sale_data.items:

            book = db.query(Book).filter(
                Book.id == item.book_id
            ).first()

            if not book:

                raise HTTPException(
                    status_code=404,
                    detail=f"Book {item.book_id} not found"
                )

            if book.stock_quantity < item.quantity:

                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {book.title}"
                )

            total_amount += book.price * item.quantity

            sale_items.append(
                {
                    "book": book,
                    "quantity": item.quantity,
                    "price": book.price
                }
            )

        sale = Sale(
            employee_id=employee_id,
            total_amount=total_amount
        )

        db.add(sale)
        db.flush()

        for item in sale_items:

            sale_item = SaleItem(
                sale_id=sale.id,
                book_id=item["book"].id,
                quantity=item["quantity"],
                price_at_sale=item["price"]
            )

            db.add(sale_item)

            item["book"].stock_quantity -= item["quantity"]

        db.commit()

        db.refresh(sale)

        return sale

    except Exception:

        db.rollback()

        raise