from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    app_id = Column(Integer, ForeignKey("apps.id", ondelete="CASCADE"), nullable=False, index=True)
    external_review_id = Column(String(255), nullable=False, index=True)
    author_name = Column(String(255), nullable=True)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text, nullable=False)
    review_date = Column(DateTime, nullable=True, index=True)
    review_version = Column(String(100), nullable=True)
    language = Column(String(50), nullable=True, default="en")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("app_id", "external_review_id", name="uq_app_external_review"),
    )

    app = relationship("App", back_populates="reviews")
    analysis = relationship("ReviewAnalysis", back_populates="review", uselist=False, cascade="all, delete-orphan")
