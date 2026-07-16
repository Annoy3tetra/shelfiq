from app.services.insights_service import get_insights_report
from ml.predict import generate_real_insights
from app.db.database import SessionLocal
from datetime import datetime, timezone, timedelta

def run_all_tests():
    # Test Case 1: Current Database (0 or <10 sales)
    db = SessionLocal()
    report_c1 = get_insights_report(db)
    db.close()
    print("--- CASE 1 OUTPUT ---")
    print("Status:", report_c1["status"])
    print("Message:", report_c1.get("message"))
    assert report_c1["status"] == "insufficient_data"

    # Test Case 2: A few sales across 12 days (>= 10 sales, < 30 days span)
    mock_sales_c2 = [
        {"sale_id": i, "total_amount": 1500 + i * 50, "sale_date": datetime.now(timezone.utc) - timedelta(days=12 - i)}
        for i in range(12)
    ]
    mock_items_c2 = [
        {
            "item_id": i,
            "sale_id": i,
            "book_title": "Atomic Habits",
            "genre": "Self-Help",
            "quantity": 2,
            "revenue": 1500,
            "stock_quantity": 5,
            "reorder_level": 10,
        }
        for i in range(12)
    ]
    report_c2 = generate_real_insights(mock_sales_c2, mock_items_c2)
    print("\n--- CASE 2 OUTPUT ---")
    print("Status:", report_c2["status"])
    print("Confidence:", report_c2["metrics"]["confidence_level"], f"({report_c2['metrics']['confidence_score']}%)")
    print("Recommendations count:", len(report_c2["recommendations"]))
    print("Sample Rec:", report_c2["recommendations"][0]["title"], "->", report_c2["recommendations"][0]["type"])
    assert report_c2["status"] == "partial_data"

    # Test Case 3: Enough data (40 sales across 45 days span)
    mock_sales_c3 = [
        {"sale_id": i, "total_amount": 2000 + (i % 5) * 200, "sale_date": datetime.now(timezone.utc) - timedelta(days=45 - i)}
        for i in range(40)
    ]
    mock_items_c3 = [
        {
            "item_id": i,
            "sale_id": i,
            "book_title": "Dune" if i % 2 == 0 else "Project Hail Mary",
            "genre": "Science Fiction",
            "quantity": 3,
            "revenue": 1800,
            "stock_quantity": 25,
            "reorder_level": 10,
        }
        if i % 2 == 0
        else {
            "item_id": i,
            "sale_id": i,
            "book_title": "Deep Work",
            "genre": "Productivity",
            "quantity": 1,
            "revenue": 600,
            "stock_quantity": 8,
            "reorder_level": 10,
        }
        for i in range(40)
    ]
    report_c3 = generate_real_insights(mock_sales_c3, mock_items_c3)
    print("\n--- CASE 3 OUTPUT ---")
    print("Status:", report_c3["status"])
    print("Confidence:", report_c3["metrics"]["confidence_level"], f"({report_c3['metrics']['confidence_score']}%)")
    print("30-Day Revenue Forecast:", report_c3["metrics"]["predicted_next_30_days_revenue"])
    print("Top Genres:", [g["genre"] for g in report_c3["top_genres"]])
    print("Sample Rec:", report_c3["recommendations"][0]["title"], "->", report_c3["recommendations"][0]["description"])
    assert report_c3["status"] == "enabled"
    print("\n[SUCCESS] ALL 3 TEST CASES PASSED WITH 100% PRECISION!")

if __name__ == "__main__":
    run_all_tests()
