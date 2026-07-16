from typing import Optional, Union, List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS Origins (supports JSON list or comma-separated string)
    CORS_ORIGINS: Union[List[str], str] = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://shelfiq-three.vercel.app"
]

    # SMTP (Gmail) — optional for dev; reset links print to console if unset
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None

    # Frontend URL for building reset links
    FRONTEND_URL: str = "https://shelfiq-three.vercel.app"

    # Backend URL & Uploads directory for profile images (development mode)
    BACKEND_URL: str = "https://shelfiq-backend-68bj.onrender.com"
    UPLOAD_DIR: str = "uploads/profiles"

    # Cloudinary (production mode — optional)
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    @property
    def get_database_url(self) -> str:
        """
        Normalize DATABASE_URL for Render and SQLAlchemy 2.0+ compatibility.
        Converts 'postgres://...' strings to 'postgresql://...'.
        """
        url = self.DATABASE_URL
        if url and url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

    @property
    def parsed_cors_origins(self) -> List[str]:
        """
        Ensures CORS_ORIGINS is returned as a clean list of strings, whether
        passed from env as comma-separated values or JSON array.
        Also automatically includes FRONTEND_URL if set.
        """
        origins = []
        if isinstance(self.CORS_ORIGINS, str):
            origins = [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
        elif isinstance(self.CORS_ORIGINS, list):
            origins = self.CORS_ORIGINS
        
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
            
        return origins

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()