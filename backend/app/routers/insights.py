from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.insights_service import get_insights_report

router = APIRouter(
    prefix="/insights-ai",
    tags=["Insights AI"]
)


@router.get("/metrics")
def get_insights_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve real time-series revenue predictions, demand forecasts,
    category velocity, and dynamic business recommendations from actual sales data.
    """
    return get_insights_report(db)
