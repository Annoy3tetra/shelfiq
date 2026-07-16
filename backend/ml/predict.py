import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge

logger = logging.getLogger(__name__)


def generate_real_insights(sales_data: List[Dict[str, Any]], items_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate real time-series revenue predictions, demand forecasts, category velocity,
    and confidence metrics from actual PostgreSQL database records.

    If sales_data is empty or < 10 records, the service layer handles returning 'insufficient_data'.
    """
    if not sales_data:
        return {
            "status": "insufficient_data",
            "message": "Not enough sales history to generate predictions."
        }

    # 1. Convert sales to DataFrame
    df_sales = pd.DataFrame(sales_data)
    df_sales["sale_date"] = pd.to_datetime(df_sales["sale_date"], utc=True)
    df_sales["date"] = df_sales["sale_date"].dt.date

    # Aggregate revenue by exact calendar date
    daily_rev = df_sales.groupby("date")["total_amount"].sum().reset_index()
    daily_rev = daily_rev.sort_values("date")

    # Fill missing dates with 0 so the time series is continuous
    min_date = daily_rev["date"].min()
    max_date = daily_rev["date"].max()
    all_dates = pd.date_range(start=min_date, end=max_date, freq="D").date
    
    df_ts = pd.DataFrame({"date": all_dates})
    df_ts = pd.merge(df_ts, daily_rev, on="date", how="left").fillna({"total_amount": 0.0})

    # Feature Engineering: days since start
    df_ts["day_num"] = np.arange(len(df_ts))
    X = df_ts[["day_num"]].values
    y = df_ts["total_amount"].values

    # Fit Ridge Regression for trend
    model = Ridge(alpha=1.0)
    if len(df_ts) >= 2:
        model.fit(X, y)
        slope = float(model.coef_[0])
        intercept = float(model.intercept_)
        r2 = float(model.score(X, y))
    else:
        slope = 0.0
        intercept = float(y[0]) if len(y) > 0 else 0.0
        r2 = 0.0

    # Predict next 30 days
    last_day_num = int(df_ts["day_num"].max()) if len(df_ts) > 0 else 0
    future_day_nums = np.arange(last_day_num + 1, last_day_num + 31).reshape(-1, 1)
    future_preds = model.predict(future_day_nums) if len(df_ts) >= 2 else np.full(30, intercept)
    
    # Ensure no negative revenue prediction
    future_preds = np.maximum(future_preds, 0.0)
    predicted_next_30_revenue = float(np.sum(future_preds))

    # Calculate growth over previous period (recent 14 days vs prior 14 days)
    total_days = len(df_ts)
    if total_days >= 14:
        recent_14 = float(df_ts.tail(14)["total_amount"].sum())
        prior_14 = float(df_ts.iloc[-28:-14]["total_amount"].sum()) if total_days >= 28 else float(df_ts.iloc[:-14]["total_amount"].sum())
        growth_percent = round(((recent_14 - prior_14) / max(prior_14, 1.0)) * 100.0, 1)
    elif total_days >= 4:
        mid = total_days // 2
        recent_half = float(df_ts.iloc[mid:]["total_amount"].sum())
        prior_half = float(df_ts.iloc[:mid]["total_amount"].sum())
        growth_percent = round(((recent_half - prior_half) / max(prior_half, 1.0)) * 100.0, 1)
    else:
        growth_percent = 0.0

    # Compute confidence indicator
    span_days = (max_date - min_date).days if isinstance(max_date, datetime) or hasattr(max_date, 'day') else len(df_ts)
    if len(sales_data) >= 50 and span_days >= 30 and r2 >= 0.3:
        confidence_level = "High"
        confidence_score = min(96, int(75 + r2 * 25))
    elif len(sales_data) >= 20 or span_days >= 14:
        confidence_level = "Moderate"
        confidence_score = int(60 + max(r2, 0.0) * 20)
    else:
        confidence_level = "Building"
        confidence_score = min(58, 35 + len(sales_data) * 2)

    # 2. Build Sales Trend Chart (Actual history + Future forecast curve)
    # Take up to last 15 days of actuals and next 15 days of forecast for clean visualization
    chart_data = []
    actual_slice = df_ts.tail(15)
    for _, row in actual_slice.iterrows():
        chart_data.append({
            "date": str(row["date"]),
            "actual_revenue": round(float(row["total_amount"]), 2),
            "predicted_revenue": round(float(row["total_amount"]), 2) if _ == actual_slice.index[-1] else None
        })

    last_date = max_date
    for i in range(1, 16):
        fut_date = last_date + timedelta(days=i)
        pred_val = float(future_preds[i - 1])
        chart_data.append({
            "date": str(fut_date),
            "actual_revenue": None,
            "predicted_revenue": round(pred_val, 2)
        })

    # 3. Analyze Category & Book Velocity from items_data
    top_genres = []
    category_chart = []
    recommendations = []

    if items_data:
        df_items = pd.DataFrame(items_data)
        
        # Group by genre
        if "genre" in df_items.columns:
            genre_summary = df_items.groupby("genre").agg(
                total_qty=("quantity", "sum"),
                total_rev=("revenue", "sum")
            ).reset_index().sort_values("total_qty", ascending=False)

            for _, grow in genre_summary.iterrows():
                g_name = str(grow["genre"])
                g_qty = int(grow["total_qty"])
                g_rev = float(grow["total_rev"])
                top_genres.append({"genre": g_name, "quantity": g_qty, "revenue": g_rev})
                
                # Predict next 30 days demand per category proportionally
                proj_qty = max(1, int(g_qty * (1.0 + (growth_percent / 100.0) * 0.5) * max(1.0, 30.0 / max(span_days, 1))))
                category_chart.append({
                    "category": g_name[:12],
                    "historical_demand": g_qty,
                    "forecasted_demand": proj_qty
                })

        # Generate intelligent actionable business recommendations
        # Recommendation 1: Fastest selling genre insight
        if top_genres:
            best_g = top_genres[0]["genre"]
            if growth_percent > 0:
                recommendations.append({
                    "title": f"Surging Demand: {best_g}",
                    "description": f"{best_g} titles are driving top inventory turnover with revenue up +{growth_percent}% recent velocity. Prioritize front-shelf placement.",
                    "type": "opportunity"
                })
            else:
                recommendations.append({
                    "title": f"Core Volume Anchor: {best_g}",
                    "description": f"{best_g} remains your highest volume category ({top_genres[0]['quantity']} units sold). Maintain steady replenishment safety stock.",
                    "type": "steady"
                })

        # Recommendation 2: Check stock vs velocity for fast-moving books
        if "book_title" in df_items.columns and "stock_quantity" in df_items.columns:
            book_summary = df_items.groupby(["book_title", "stock_quantity", "reorder_level"]).agg(
                sold=("quantity", "sum")
            ).reset_index().sort_values("sold", ascending=False)

            low_stock_found = False
            for _, brow in book_summary.iterrows():
                b_title = str(brow["book_title"])
                b_sold = int(brow["sold"])
                b_stock = int(brow["stock_quantity"]) if pd.notnull(brow["stock_quantity"]) else 0
                b_reorder = int(brow["reorder_level"]) if pd.notnull(brow["reorder_level"]) else 5
                
                # Calculate estimated days until stockout based on daily velocity
                daily_vel = max(b_sold / max(span_days, 1), 0.1)
                days_left = int(b_stock / daily_vel) if daily_vel > 0 else 999

                if b_stock <= b_reorder * 1.5 or days_left <= 10:
                    recommendations.append({
                        "title": f"Restock Alert: {b_title}",
                        "description": f"At current daily velocity ({round(daily_vel, 1)}/day), {b_title} will reach critical stockout in approx. {max(1, days_left)} days (Stock: {b_stock}).",
                        "type": "alert"
                    })
                    low_stock_found = True
                    break

            if not low_stock_found and len(book_summary) > 0:
                top_b = book_summary.iloc[0]["book_title"]
                recommendations.append({
                    "title": f"Bestseller Performance: {top_b}",
                    "description": f"No immediate stockout warnings across fast movers. {top_b} leads overall volume with {int(book_summary.iloc[0]['sold'])} sales.",
                    "type": "info"
                })

        # Recommendation 3: Macro revenue guidance
        if growth_percent >= 10:
            recommendations.append({
                "title": "Positive Revenue Momentum",
                "description": f"Overall bookstore revenue velocity is trending upward (+{growth_percent}%). Consider expanding high-margin promotional bundles.",
                "type": "opportunity"
            })
        elif growth_percent <= -10:
            recommendations.append({
                "title": "Demand Contraction Guidance",
                "description": f"Recent revenue velocity dipped ({growth_percent}%). Review pricing competitiveness and initiate targeted loyalty discounts.",
                "type": "warning"
            })
        else:
            recommendations.append({
                "title": "Stable Baseline Demand",
                "description": "Daily store sales are holding within a predictable demand band. Focus on inventory carrying cost optimization.",
                "type": "steady"
            })

    return {
        "status": "enabled" if span_days >= 30 else "partial_data",
        "metrics": {
            "predicted_next_30_days_revenue": round(predicted_next_30_revenue, 2),
            "growth_percent": growth_percent,
            "confidence_level": confidence_level,
            "confidence_score": confidence_score,
            "span_days": span_days,
            "total_sales_count": len(sales_data)
        },
        "charts": {
            "sales_trend_chart": chart_data,
            "demand_forecast_chart": category_chart[:6]
        },
        "recommendations": recommendations,
        "top_genres": top_genres[:5]
    }