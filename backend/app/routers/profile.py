import os
import shutil
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.get("/me", response_model=UserResponse)
def get_profile_me(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user profile including profile_image_url.
    """
    return current_user


@router.post("/upload-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a new profile image.
    Validates file format (PNG, JPG, JPEG, WEBP) and size limit (5 MB).
    Stores locally in development or on Cloudinary when configured.
    """
    # 1. Validate Content-Type
    content_type = file.content_type
    if not content_type or content_type.lower() not in ALLOWED_IMAGE_TYPES:
        # Check by filename extension fallback
        filename = file.filename or ""
        ext_lower = os.path.splitext(filename)[1].lower()
        valid_exts = {".png", ".jpg", ".jpeg", ".webp"}
        if ext_lower not in valid_exts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file format. Allowed formats are PNG, JPG, JPEG, and WEBP."
            )
        file_ext = ext_lower
    else:
        file_ext = ALLOWED_IMAGE_TYPES[content_type.lower()]

    # 2. Read contents and validate Size Limit (5 MB)
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 5 MB limit."
        )

    # Reset file pointer if needed by uploader
    await file.seek(0)

    image_url: str = ""

    # 3. Store Image: Cloudinary (Production) vs Local Storage (Development)
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        try:
            import cloudinary
            import cloudinary.uploader

            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET
            )

            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file.file,
                folder="shelfiq/profiles",
                public_id=f"user_{current_user.id}_{uuid.uuid4().hex[:8]}",
                overwrite=True,
                resource_type="image"
            )
            image_url = upload_result.get("secure_url") or upload_result.get("url")
        except ImportError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Cloudinary configuration is set, but 'cloudinary' package is not installed."
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload image to Cloudinary: {str(e)}"
            )
    else:
        # Development mode — local disk storage
        upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", settings.UPLOAD_DIR))
        os.makedirs(upload_dir, exist_ok=True)

        unique_filename = f"avatar_{current_user.id}_{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)

        try:
            with open(file_path, "wb") as buffer:
                buffer.write(contents)
            
            # Construct accessible URL using settings.BACKEND_URL
            # Since UPLOAD_DIR is mounted at /uploads/profiles
            rel_path = f"/{settings.UPLOAD_DIR}/{unique_filename}".replace("//", "/")
            image_url = f"{settings.BACKEND_URL.rstrip('/')}{rel_path}"
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save image locally: {str(e)}"
            )

    # 4. Save Image URL in Database
    current_user.profile_image_url = image_url
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile image updated successfully.",
        "profile_image_url": image_url,
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
            "profile_image_url": current_user.profile_image_url
        }
    }
