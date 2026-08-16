from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    platform = Column(String(50), nullable=False, index=True)  # APPLE, GOOGLE_PLAY
    app_store_id = Column(String(255), nullable=True, index=True)
    package_name = Column(String(255), nullable=True, index=True)
    developer_name = Column(String(255), nullable=True)
    store_url = Column(Text, nullable=True)
    icon_url = Column(Text, nullable=True)
    current_rating = Column(Float, nullable=True)
    review_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    organization = relationship("Organization", back_populates="apps")
    reviews = relationship("Review", back_populates="app", cascade="all, delete-orphan")
    metrics = relationship("AppMetric", back_populates="app", cascade="all, delete-orphan")
    themes = relationship("AppTheme", back_populates="app", cascade="all, delete-orphan")
