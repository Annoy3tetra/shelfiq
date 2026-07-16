import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.test import router as test_router
from app.routers.auth import router as auth_router
from app.routers.book import router as book_router
from app.routers.sale import router as sale_router
from app.routers.dashboard import router as dashboard_router
from app.routers.forecast import router as forecast_router
from app.routers.profile import router as profile_router


# Ensure uploads directory exists on startup
os.makedirs("uploads/profiles", exist_ok=True)

app = FastAPI(
    title="Bookstore ERP API",
    version="1.0.0"
)

# Configure dynamic CORS middleware for Vercel production and local environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_cors_origins,
    allow_origin_regex=r"https://shelfiq-three.vercel.app/",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local static directory for profile images (development fallback)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(test_router)
app.include_router(auth_router)
app.include_router(book_router)
app.include_router(sale_router)
app.include_router(dashboard_router)
app.include_router(forecast_router)
app.include_router(profile_router)


@app.get("/health", tags=["Health Check"])
def health_check():
    """
    Production health check endpoint for Render Web Service monitoring.
    """
    return {
        "status": "healthy",
        "service": "ShelfIQ Bookstore ERP Backend",
        "version": "1.0.0"
    }


@app.get("/")
def root():
    return {
        "message": "Bookstore ERP Backend is running"
    }