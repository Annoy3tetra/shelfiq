import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge

from app.db.database import SessionLocal
from app.models.sale import Sale

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def train_and_save_model():
    """
    Retrain the Ridge Regression model on real historical sales records in PostgreSQL.
    Saves the trained pipeline to ml/model.pkl.
    """
    db = SessionLocal()
    try:
        sales = db.query(Sale).all()
        if not sales or len(sales) < 2:
            logger.warning("Not enough database sales records to train model. Minimum 2 required.")
            return

        data = []
        for s in sales:
            data.append({
                "sale_date": s.sale_date,
                "total_amount": float(s.total_amount)
            })

        df = pd.DataFrame(data)
        df["sale_date"] = pd.to_datetime(df["sale_date"], utc=True)
        df["date"] = df["sale_date"].dt.date
        
        daily_rev = df.groupby("date")["total_amount"].sum().reset_index().sort_values("date")
        daily_rev["day_num"] = np.arange(len(daily_rev))

        X = daily_rev[["day_num"]].values
        y = daily_rev["total_amount"].values

        model = Ridge(alpha=1.0)
        model.fit(X, y)

        joblib.dump(model, "ml/model.pkl")
        logger.info(f"Model successfully retrained on {len(sales)} sales across {len(daily_rev)} unique days.")
    finally:
        db.close()


if __name__ == "__main__":
    train_and_save_model()