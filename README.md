# App Review Intelligence Platform

Autonomous cross-platform mobile application discovery, customer review harvesting, VADER NLP sentiment analysis, recurring topic/issue extraction, and executive intelligence dashboard.

---

## Architecture Overview

```
                          React + Vite (Frontend)
                                    │
                                 REST API
                                    │
                            FastAPI (Backend)
                                    │
                ┌───────────────────┴───────────────────┐
                │                                       │
            API Layer                             Service Layer
                                                        │
                                            ┌───────────┴───────────┐
                                            │                       │
                                   Repository Layer             Collectors
                                            │                       │
                                       SQLAlchemy          ├── Apple App Store
                                            │              └── Google Play Store
                                          MySQL / SQLite
```

---

## Features

- **Cross-Store Discovery**: Automatically identifies and validates mobile apps across Apple App Store and Google Play associated with an enterprise using deterministic confidence matching.
- **Incremental Sync**: Fetches customer reviews and prevents duplication via unique constraint hashing.
- **VADER Sentiment Strategy**: Abstracted NLP pipeline scoring valence, polarity distribution, and confidence level for every review.
- **Topic & Friction Clustering**: Categorizes reviews into key functional areas (Login & Auth, Crashes & Stability, Performance, Ads, Notifications, UI/UX, Camera/Media, Payments, Battery).
- **Executive Dashboards**: Global overview, cross-app comparison matrix, Apple iOS vs Google Play Android parity comparison, and historical timeline trends.
- **Actionable Insights Engine**: Rule-based synthesis that highlights critical friction points and actionable recommendations.

---

## Getting Started

### 1. Backend Setup

```bash
# Navigate to project root
cd App-Sentiment-Checker

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run migrations
alembic -c backend/alembic.ini upgrade head

# Start FastAPI backend server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend/
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```

The application will be accessible at:
- **Frontend Dashboard**: `http://localhost:5173`
- **FastAPI Interactive Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

---

## Running Automated Tests

```bash
.\.venv\Scripts\pytest -v
```
