from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User

from app.core.auth import get_current_user

from app.schemas.sale import (
    SaleCreate,
    SaleResponse
)

from app.services.sale_service import create_sale


router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)

@router.post(
    "/",
    response_model=SaleResponse
)
def create_new_sale(
    sale_data: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return create_sale(
        db=db,
        sale_data=sale_data,
        employee_id=current_user.id
    )