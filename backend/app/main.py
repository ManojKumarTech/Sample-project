from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.core.exceptions import AppIntelligenceException
from backend.app.api.routes import (
    organizations_router,
    apps_router,
    reviews_router,
    dashboard_router,
)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Cross-platform Mobile App Discovery, Sentiment Intelligence, and Actionable Insights Platform",
)

# CORS Configuration
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    origins = [origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    logger.info(f"Starting {settings.APP_NAME} in {settings.APP_ENV} environment.")


@app.exception_handler(AppIntelligenceException)
async def app_exception_handler(request: Request, exc: AppIntelligenceException):
    logger.error(f"AppIntelligenceException: [{exc.code}] {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            }
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected internal server error occurred.",
            }
        },
    )


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint required by MVP specification."""
    return {"status": "ok"}


# Include API Routers under /api
app.include_router(organizations_router, prefix=settings.API_V1_STR)
app.include_router(apps_router, prefix=settings.API_V1_STR)
app.include_router(reviews_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
