from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.session import get_db

from app.models.book import Book
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.user import User


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    total_books = db.query(Book).count()

    total_sales_count = db.query(Sale).count()

    low_stock_books = db.query(Book).filter(
        Book.stock_quantity <= Book.reorder_level
    ).count()

    today = datetime.now(timezone.utc).date()

    today_sales = db.query(
        func.coalesce(
            func.sum(Sale.total_amount),
            0
        )
    ).filter(
        func.date(Sale.sale_date) == today
    ).scalar()

    return {
        "total_books": total_books,
        "total_sales": total_sales_count,
        "low_stock_books": low_stock_books,
        "today_sales": today_sales
    }
    
@router.get("/top-books")
def get_top_books(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    results = (
        db.query(
            Book.title,
            func.sum(
                SaleItem.quantity
            ).label("sold")
        )
        .join(
            SaleItem,
            Book.id == SaleItem.book_id
        )
        .group_by(
            Book.id
        )
        .order_by(
            func.sum(
                SaleItem.quantity
            ).desc()
        )
        .limit(limit)
        .all()
    )

    return [
        {
            "title": title,
            "sold": sold
        }
        for title, sold in results
    ]
    
@router.get("/sales-trend")
def sales_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    results = (
        db.query(
            func.date(
                Sale.sale_date
            ).label("date"),

            func.sum(
                Sale.total_amount
            ).label("revenue")
        )
        .group_by(
            func.date(
                Sale.sale_date
            )
        )
        .order_by(
            func.date(
                Sale.sale_date
            )
        )
        .all()
    )

    return [
        {
            "date": str(date),
            "revenue": revenue
        }
        for date, revenue in results
    ]