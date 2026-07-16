import logging
from typing import Any, Dict
from sqlalchemy.orm import Session

from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.book import Book
from ml.predict import generate_real_insights

logger = logging.getLogger(__name__)


def get_insights_report(db: Session) -> Dict[str, Any]:
    """
    Retrieve real historical sales data from PostgreSQL and compute AI insights & predictions.
    Enforces minimum data thresholds:
    - < 10 sales: returns status = 'insufficient_data'
    - >= 10 sales: returns AI predictions and recommendations (status = 'partial_data' or 'enabled')
    """
    # Query all sales ordered by sale_date
    sales = db.query(Sale).order_by(Sale.sale_date.asc()).all()

    if len(sales) < 10:
        return {
            "status": "insufficient_data",
            "message": "Not enough sales history to generate predictions. A minimum of 10 sales records is required."
        }

    # Prepare sales list for ML engine
    sales_data = []
    for s in sales:
        sales_data.append({
            "sale_id": s.id,
            "total_amount": float(s.total_amount),
            "sale_date": s.sale_date
        })

    # Query items with joined book info
    items = db.query(SaleItem, Book).join(Book, SaleItem.book_id == Book.id).all()
    items_data = []
    for item, book in items:
        # Convert enum or string genre cleanly
        genre_str = book.genre.value if hasattr(book.genre, "value") else str(book.genre)
        items_data.append({
            "item_id": item.id,
            "sale_id": item.sale_id,
            "book_title": book.title,
            "genre": genre_str,
            "quantity": item.quantity,
            "revenue": float(item.quantity * item.price_at_sale),
            "stock_quantity": book.stock_quantity,
            "reorder_level": book.reorder_level
        })

    return generate_real_insights(sales_data, items_data)
