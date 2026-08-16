from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class ReviewAnalysis(Base):
    __tablename__ = "review_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    review_id = Column(Integer, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    sentiment = Column(String(50), nullable=False)  # POSITIVE, NEUTRAL, NEGATIVE
    sentiment_score = Column(Float, nullable=False)  # Compound score -1.0 to +1.0
    confidence = Column(Float, nullable=False)  # 0.0 to 1.0
    analyzed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    review = relationship("Review", back_populates="analysis")
