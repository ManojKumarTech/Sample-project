from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class AppTheme(Base):
    __tablename__ = "app_themes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    app_id = Column(Integer, ForeignKey("apps.id", ondelete="CASCADE"), nullable=False, index=True)
    theme_name = Column(String(100), nullable=False)
    theme_type = Column(String(50), nullable=False, default="GENERAL")  # POSITIVE, NEGATIVE, GENERAL
    review_count = Column(Integer, default=0, nullable=False)
    percentage = Column(Float, default=0.0, nullable=False)
    sentiment = Column(String(50), nullable=True)
    period_start = Column(DateTime, nullable=True)
    period_end = Column(DateTime, nullable=True)

    app = relationship("App", back_populates="themes")
