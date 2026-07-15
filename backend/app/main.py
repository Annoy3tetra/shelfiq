from fastapi import FastAPI

from app.routers.test import router as test_router
from app.routers.auth import router as auth_router
from app.routers.book import router as book_router
from app.routers.sale import router as sale_router
from app.routers.dashboard import router as dashboard_router
from app.routers.forecast import router as forecast_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Bookstore ERP API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_router)
app.include_router(auth_router)
app.include_router(book_router)
app.include_router(sale_router)
app.include_router(dashboard_router)
app.include_router(forecast_router)


@app.get("/")
def root():
    return {
        "message": "Bookstore ERP Backend is running"
    }