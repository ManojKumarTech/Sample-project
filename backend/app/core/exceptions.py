"""Custom exceptions and centralized error handling."""
from typing import Any, Optional


class AppIntelligenceException(Exception):
    """Base exception for all application errors."""

    def __init__(self, message: str, code: str = "INTERNAL_SERVER_ERROR", status_code: int = 500, details: Optional[Any] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details


class OrganizationNotFound(AppIntelligenceException):
    def __init__(self, message: str = "Organization could not be found.", details: Optional[Any] = None):
        super().__init__(message=message, code="ORGANIZATION_NOT_FOUND", status_code=404, details=details)


class AppNotFound(AppIntelligenceException):
    def __init__(self, message: str = "Application could not be found.", details: Optional[Any] = None):
        super().__init__(message=message, code="APP_NOT_FOUND", status_code=404, details=details)


class InvalidOrganization(AppIntelligenceException):
    def __init__(self, message: str = "Invalid organization name.", details: Optional[Any] = None):
        super().__init__(message=message, code="INVALID_ORGANIZATION", status_code=400, details=details)


class CollectorError(AppIntelligenceException):
    def __init__(self, message: str = "Store collector encountered an error.", details: Optional[Any] = None):
        super().__init__(message=message, code="COLLECTOR_ERROR", status_code=502, details=details)


class ReviewCollectionError(AppIntelligenceException):
    def __init__(self, message: str = "Failed to collect reviews.", details: Optional[Any] = None):
        super().__init__(message=message, code="REVIEW_COLLECTION_ERROR", status_code=502, details=details)


class DatabaseError(AppIntelligenceException):
    def __init__(self, message: str = "Database operation failed.", details: Optional[Any] = None):
        super().__init__(message=message, code="DATABASE_ERROR", status_code=500, details=details)
