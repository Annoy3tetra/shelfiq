from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


# Use normalized database URL (`postgresql://...`) and configure production
# connection pooling parameters (pool_pre_ping prevents stale SSL EOF drops on Render).
engine = create_engine(
    settings.get_database_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()