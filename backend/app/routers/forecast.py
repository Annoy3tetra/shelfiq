from fastapi import APIRouter
from fastapi import Depends

from app.models.user import User
from app.core.auth import get_current_user

from ml.predict import predict_sales


router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"]
)


@router.get("/monthly-sales")
def forecast_sales(
    month: int,
    current_user: User = Depends(
        get_current_user
    )
):

    prediction = predict_sales(
        month
    )

    return {
        "month": month,
        "predicted_sales": round(
            prediction,
            2
        )
    }