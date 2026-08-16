# App Review Intelligence Platform
## MVP Development Specification

**Version:** 1.0  
**Status:** Development  
**Purpose:** Master specification for building the MVP using Antigravity or an AI coding agent.

---

# 1. Product Overview

## 1.1 Product Name

**App Review Intelligence**

## 1.2 Product Description

App Review Intelligence is a web-based platform that allows a user to enter an organization name and automatically discover publicly available mobile applications associated with that organization across:

- Apple App Store
- Google Play Store

The system collects publicly available app reviews, stores and normalizes them, performs sentiment analysis, identifies recurring themes/issues, calculates application-level metrics, and presents the results through a centralized dashboard.

## 1.3 Example

User enters:

```text
Meta
```

The system should attempt to discover applications such as:

```text
Instagram
Facebook
WhatsApp
Threads
Messenger
```

For each application, the system should identify available platforms and collect review information.

The final dashboard should provide:

- Organization-level overview
- Application-level metrics
- Platform comparison
- Sentiment analysis
- Review trends
- Positive themes
- Negative themes
- Recent reviews
- Actionable insights

---

# 2. Problem Statement

Organizations may have multiple mobile applications distributed across different app stores.

Product teams currently need to:

1. Search for each application.
2. Open the App Store or Play Store.
3. Read reviews manually.
4. Repeat the process for every application.
5. Compare feedback across applications.
6. Manually identify recurring problems.

This process is:

- Time-consuming
- Repetitive
- Difficult to scale
- Difficult to compare across platforms
- Difficult to identify trends

The proposed platform centralizes this process.

---

# 3. MVP Goal

The MVP must demonstrate the complete workflow:

```text
Organization Name
        ↓
Application Discovery
        ↓
Application Validation
        ↓
Review Collection
        ↓
Review Normalization
        ↓
Duplicate Detection
        ↓
Sentiment Analysis
        ↓
Theme Detection
        ↓
Metric Aggregation
        ↓
Dashboard
        ↓
Actionable Insights
```

The MVP should be functional end-to-end.

---

# 4. Technology Stack

## 4.1 Frontend

Use:

- React
- Vite
- JavaScript
- Axios
- React Router
- Recharts

Do not introduce unnecessary frontend libraries.

---

## 4.2 Backend

Use:

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- HTTPX

---

## 4.3 Database

Use:

- MySQL 8+

Character set:

```text
utf8mb4
```

Collation:

```text
utf8mb4_unicode_ci
```

---

## 4.4 Sentiment Analysis

For the first MVP implementation:

- VADER or another free local sentiment solution

The sentiment layer must be abstracted behind an interface so it can later be replaced with:

- Transformer model
- LLM
- Claude API
- OpenAI API
- Other local models

Do not tightly couple business logic to VADER.

---

## 4.5 Java

Java/Spring Boot is NOT required for the MVP.

The initial architecture should be:

```text
React
  ↓
FastAPI
  ↓
SQLAlchemy
  ↓
MySQL
```

Java can be introduced in a future version only if there is a clear architectural requirement.

---

# 5. Architecture

Use a layered architecture.

```text
                    React Frontend
                          │
                       REST API
                          │
                    FastAPI Backend
                          │
              ┌───────────┴───────────┐
              │                       │
         API Layer               Service Layer
                                      │
                              Business Logic
                                      │
                              Repository Layer
                                      │
                                  SQLAlchemy
                                      │
                                    MySQL


External Data Sources
        │
        ├── Apple App Store
        │
        └── Google Play Store
                 │
             Collectors
                 │
             Services
                 │
              Database
```

---

# 6. Core Architectural Principles

The project must follow:

- SOLID principles
- Separation of concerns
- Dependency inversion
- Single responsibility
- DRY
- KISS
- Repository pattern
- Service layer
- Strategy pattern where appropriate
- Factory pattern where appropriate
- Dependency injection
- Configuration through environment variables
- Centralized error handling
- Structured logging
- Type hints
- Validation
- Unit testing

Do not over-engineer the MVP.

---

# 7. Backend Project Structure

Use this structure:

```text
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── dependencies.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── organizations.py
│   │       ├── apps.py
│   │       ├── reviews.py
│   │       └── dashboard.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── logging.py
│   │   └── exceptions.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── organization.py
│   │   ├── app.py
│   │   ├── review.py
│   │   ├── review_analysis.py
│   │   ├── app_metric.py
│   │   └── app_theme.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── organization.py
│   │   ├── app.py
│   │   ├── review.py
│   │   └── dashboard.py
│   │
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── organization_repository.py
│   │   ├── app_repository.py
│   │   ├── review_repository.py
│   │   └── metric_repository.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── organization_service.py
│   │   ├── app_discovery_service.py
│   │   ├── review_service.py
│   │   ├── sentiment_service.py
│   │   ├── theme_service.py
│   │   └── dashboard_service.py
│   │
│   ├── collectors/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── app_store.py
│   │   └── play_store.py
│   │
│   └── utils/
│       ├── __init__.py
│       ├── normalization.py
│       └── deduplication.py
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── alembic/
├── .env
├── .env.example
├── alembic.ini
├── requirements.txt
└── README.md
```

---

# 8. Frontend Project Structure

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── OrganizationSearch.jsx
│   │   ├── AppCard.jsx
│   │   ├── SentimentSummary.jsx
│   │   ├── SentimentChart.jsx
│   │   ├── ThemeList.jsx
│   │   ├── ReviewTable.jsx
│   │   └── LoadingState.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── OrganizationDashboard.jsx
│   │   ├── AppDashboard.jsx
│   │   └── Reviews.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │   └── useDashboard.js
│   │
│   ├── utils/
│   │   └── formatters.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

# 9. Database Design

## 9.1 Organizations

Table:

```text
organizations
```

Columns:

```text
id
name
normalized_name
created_at
updated_at
```

Rules:

- `name` is the display name.
- `normalized_name` is used for searching/deduplication.
- Organization names must be normalized before comparison.

---

# 10. Applications

Table:

```text
apps
```

Columns:

```text
id
organization_id
name
platform
app_store_id
package_name
developer_name
store_url
icon_url
current_rating
review_count
created_at
updated_at
```

Platform values:

```text
APPLE
GOOGLE_PLAY
```

An application must belong to an organization.

---

# 11. Reviews

Table:

```text
reviews
```

Columns:

```text
id
app_id
external_review_id
author_name
rating
review_text
review_date
review_version
language
created_at
updated_at
```

Important:

`external_review_id` must be used for duplicate prevention.

Unique constraint:

```text
app_id + external_review_id
```

The same review must never be stored twice.

---

# 12. Review Analysis

Table:

```text
review_analysis
```

Columns:

```text
id
review_id
sentiment
sentiment_score
confidence
analyzed_at
```

Sentiment values:

```text
POSITIVE
NEUTRAL
NEGATIVE
```

---

# 13. Application Metrics

Table:

```text
app_metrics
```

Columns:

```text
id
app_id
period
review_count
average_rating
positive_count
neutral_count
negative_count
sentiment_score
created_at
```

Metrics should be calculated periodically rather than recalculated from every review for every dashboard request.

---

# 14. Application Themes

Table:

```text
app_themes
```

Columns:

```text
id
app_id
theme_name
theme_type
review_count
percentage
sentiment
period_start
period_end
```

Examples:

```text
Login
Performance
Crashes
Notifications
Ads
UI/UX
Features
Payments
Security
```

---

# 15. Application Discovery Business Logic

The user provides:

```text
organization_name
```

Example:

```text
Meta
```

The system must:

1. Normalize organization name.
2. Search Apple App Store.
3. Search Google Play Store.
4. Identify potential applications.
5. Identify developer/publisher.
6. Match developer/publisher with organization.
7. Assign a confidence level.
8. Deduplicate applications.
9. Save validated applications.
10. Return discovered applications.

Do not blindly assume every search result belongs to the organization.

---

# 16. Organization Matching

Application discovery must support confidence.

Example:

```text
Instagram
Developer: Meta Platforms, Inc.
Confidence: HIGH
```

Potential unrelated result:

```text
ABC Messenger
Developer: ABC Apps Ltd.
Confidence: LOW
```

The system should not automatically include low-confidence results without validation rules.

For the MVP, use deterministic matching based on:

- Developer name
- Publisher name
- Organization name
- Known aliases
- Store metadata

Design the system so a more advanced matching algorithm can be added later.

---

# 17. Collector Architecture

Store-specific logic must be isolated.

Create an abstract collector interface.

Conceptually:

```python
class AppStoreCollector:
    def discover_apps(...)
    def fetch_reviews(...)
```

Implement:

```text
AppleAppStoreCollector
GooglePlayCollector
```

The rest of the application must not know how the data was collected.

---

# 18. Collector Factory

Use a factory where appropriate:

```text
CollectorFactory
       │
       ├── APPLE → AppleAppStoreCollector
       │
       └── GOOGLE_PLAY → GooglePlayCollector
```

This prevents platform-specific logic from spreading throughout the codebase.

---

# 19. Review Collection

For every application:

```text
Application
    ↓
Collector
    ↓
Fetch reviews
    ↓
Normalize reviews
    ↓
Check duplicate
    ↓
Store new reviews
```

The system should support incremental synchronization.

Do NOT delete existing reviews during synchronization.

---

# 20. Incremental Sync

Suppose the database contains:

```text
Review A
Review B
Review C
```

A new sync returns:

```text
Review A
Review B
Review C
Review D
Review E
```

Only:

```text
Review D
Review E
```

should be inserted.

Existing reviews must remain unchanged unless the source explicitly provides updated information.

---

# 21. Sentiment Analysis

Sentiment analysis should occur after a review is inserted.

Pipeline:

```text
New Review
    ↓
Sentiment Analyzer
    ↓
Sentiment Result
    ↓
Store Review Analysis
```

Example:

```json
{
  "sentiment": "NEGATIVE",
  "sentiment_score": -0.72,
  "confidence": 0.89
}
```

Do not run sentiment analysis again for reviews that have already been analyzed unless explicitly requested.

---

# 22. Sentiment Strategy

Create an abstraction:

```text
SentimentAnalyzer
```

Initial implementation:

```text
VaderSentimentAnalyzer
```

Future implementations:

```text
TransformerSentimentAnalyzer
LlmSentimentAnalyzer
```

The service layer must depend on the abstraction rather than VADER directly.

---

# 23. Theme Detection

The MVP should identify recurring topics from reviews.

Examples:

```text
Login
Crashes
Performance
Ads
Notifications
Payments
UI/UX
Features
Security
Battery
Network
```

Themes should be associated with:

- Number of reviews
- Percentage
- Sentiment

Example:

```text
Login Issues
Reviews: 2,450
Percentage: 31%
Sentiment: Negative
```

---

# 24. Dashboard Business Logic

Organization dashboard must show:

## Overview

```text
Total Applications
Total Reviews
Average Rating
Positive %
Neutral %
Negative %
```

## Application comparison

For every application:

```text
App Name
Platform
Rating
Review Count
Positive %
Neutral %
Negative %
```

## Top issues

```text
Login
Crashes
Performance
Notifications
Ads
```

## Trends

Show:

- Sentiment over time
- Rating over time
- Review volume over time

---

# 25. App Dashboard

When the user selects an application:

Show:

```text
Application Name
Platform
Rating
Review Count
```

Then:

```text
Sentiment Distribution
Sentiment Trend
Top Positive Themes
Top Negative Themes
Recent Reviews
```

---

# 26. Cross-Platform Comparison

The system should allow:

```text
Instagram
```

to be compared across:

```text
Apple App Store
Google Play
```

Metrics:

```text
Rating
Review count
Positive %
Neutral %
Negative %
Top complaints
```

Example insight:

```text
Android users report more performance-related complaints
than iOS users.
```

---

# 27. Actionable Insights

The MVP should generate simple rule-based insights.

Examples:

```text
Negative sentiment increased by 18% this month.
```

```text
Login-related complaints increased by 31%.
```

```text
Performance is the most common negative theme.
```

```text
Android has a higher percentage of negative reviews than iOS.
```

Do not require an LLM for the initial implementation.

The architecture should allow LLM-generated insights later.

---

# 28. API Design

Use business-oriented REST endpoints.

## Organization discovery

```http
POST /api/organizations/discover
```

Request:

```json
{
  "name": "Meta"
}
```

Response:

```json
{
  "organization_id": 1,
  "name": "Meta",
  "apps_found": 5
}
```

---

## Organization

```http
GET /api/organizations/{organization_id}
```

---

## Organization applications

```http
GET /api/organizations/{organization_id}/apps
```

---

## Organization dashboard

```http
GET /api/organizations/{organization_id}/dashboard
```

---

## Application

```http
GET /api/apps/{app_id}
```

---

## Application reviews

```http
GET /api/apps/{app_id}/reviews
```

Support pagination.

---

## Application sentiment

```http
GET /api/apps/{app_id}/sentiment
```

---

## Application themes

```http
GET /api/apps/{app_id}/themes
```

---

## Application trends

```http
GET /api/apps/{app_id}/trends
```

---

## Manual synchronization

```http
POST /api/apps/{app_id}/sync
```

The MVP should provide a manual sync button.

Automated scheduled synchronization can be added later.

---

# 29. API Rules

All APIs must:

- Validate input
- Return appropriate HTTP status codes
- Handle errors consistently
- Use Pydantic schemas
- Use dependency injection
- Never expose database models directly
- Use pagination for review lists
- Avoid unnecessary database queries

Do not place business logic inside route handlers.

Bad:

```text
route
 ├── database query
 ├── scraping
 ├── sentiment
 ├── calculations
 └── response
```

Good:

```text
route
  ↓
service
  ↓
repository
```

---

# 30. Repository Pattern

Repositories should handle database access.

Example responsibilities:

```text
OrganizationRepository
    create
    get_by_id
    get_by_name

AppRepository
    create
    get_by_id
    get_by_organization
    find_existing

ReviewRepository
    create
    bulk_create
    find_by_external_id
    get_by_app
```

Repositories should NOT contain business decisions.

---

# 31. Service Layer

Services contain business logic.

Examples:

```text
OrganizationService
AppDiscoveryService
ReviewService
SentimentService
ThemeService
DashboardService
```

Example:

```text
OrganizationService
        ↓
AppDiscoveryService
        ↓
Collectors
        ↓
AppRepository
```

---

# 32. Database Rules

Use:

- SQLAlchemy ORM
- Alembic migrations
- Foreign keys
- Indexes
- Unique constraints
- Transactions

Do not manually modify production schema.

Schema changes must be made through Alembic migrations.

---

# 33. Important Database Indexes

At minimum consider indexes on:

```text
organizations.normalized_name

apps.organization_id

apps.platform

apps.app_store_id

apps.package_name

reviews.app_id

reviews.external_review_id

reviews.review_date

review_analysis.review_id

app_metrics.app_id
```

---

# 34. Pagination

Never return thousands of reviews in one API response.

Use:

```text
GET /api/apps/{app_id}/reviews?page=1&page_size=50
```

Response should contain:

```json
{
  "items": [],
  "page": 1,
  "page_size": 50,
  "total": 1000,
  "total_pages": 20
}
```

---

# 35. Error Handling

Create centralized application exceptions.

Examples:

```text
OrganizationNotFound
AppNotFound
CollectorError
ReviewCollectionError
DatabaseError
InvalidOrganization
```

Return appropriate HTTP responses.

Example:

```json
{
  "error": {
    "code": "ORGANIZATION_NOT_FOUND",
    "message": "Organization could not be found."
  }
}
```

Do not expose stack traces to users.

---

# 36. Configuration

Use `.env`.

Example:

```env
APP_NAME=App Review Intelligence
APP_ENV=development

DATABASE_URL=mysql+pymysql://username:password@localhost:3306/app_review_intelligence

CORS_ORIGINS=http://localhost:5173
```

Create:

```text
.env.example
```

Never commit real credentials.

---

# 37. Frontend Pages

Create:

```text
/
```

Home/search page.

```text
/organizations/:id
```

Organization dashboard.

```text
/apps/:id
```

Application dashboard.

```text
/apps/:id/reviews
```

Review explorer.

---

# 38. Frontend User Flow

The primary flow must be:

```text
Home
 ↓
Enter organization
 ↓
Analyze
 ↓
Loading
 ↓
Organization Dashboard
 ↓
Select App
 ↓
App Dashboard
 ↓
View Reviews
```

---

# 39. Loading States

The frontend must clearly show progress.

Example:

```text
Discovering applications...
```

Then:

```text
Found 8 applications.
```

Then:

```text
Collecting reviews...
```

Then:

```text
Analyzing reviews...
```

Then:

```text
Dashboard ready.
```

Do not leave the user staring at a blank page.

---

# 40. Frontend API Layer

Do not directly use Axios throughout components.

Create:

```text
src/services/api.js
```

Example conceptual API functions:

```text
discoverOrganization()
getOrganization()
getOrganizationApps()
getDashboard()
getApp()
getReviews()
getSentiment()
getThemes()
syncApp()
```

Components should call these services rather than constructing URLs everywhere.

---

# 41. UI Requirements

The UI should be:

- Clean
- Professional
- Responsive
- Desktop-first
- Easy to understand
- Data-focused

Use cards, tables, charts and badges.

Do not prioritize excessive animations.

---

# 42. Security

Even though this is an MVP:

- Never expose database credentials.
- Never expose API secrets to React.
- Validate user input.
- Sanitize external data.
- Avoid arbitrary URL fetching.
- Configure CORS properly.
- Do not log secrets.
- Do not trust scraped content.

---

# 43. External Data Handling

External store data is untrusted input.

Every collector must:

1. Fetch data.
2. Validate response.
3. Parse safely.
4. Normalize fields.
5. Handle missing fields.
6. Handle malformed reviews.
7. Log failures.
8. Continue processing other applications where possible.

One failed application must not crash the entire organization analysis.

---

# 44. Resilience

Example:

```text
Meta
 ├── Instagram      ✓
 ├── WhatsApp       ✓
 ├── Facebook       ✗
 ├── Threads        ✓
 └── Messenger      ✓
```

The system should still produce a dashboard.

Record:

```text
Facebook → synchronization failed
```

rather than failing the entire request.

---

# 45. Caching

For the MVP:

- Cache discovered application metadata where practical.
- Store collected reviews in MySQL.
- Do not repeatedly request the same data unnecessarily.

Future versions can introduce Redis.

Do NOT add Redis unless needed.

---

# 46. Performance

Avoid:

```text
N+1 database queries
```

Use appropriate joins/eager loading where needed.

Dashboard APIs should retrieve aggregated metrics rather than calculating everything from raw reviews every time.

---

# 47. Testing Strategy

Create:

```text
tests/unit/
tests/integration/
```

Unit test:

- Organization normalization
- Application matching
- Duplicate detection
- Sentiment classification
- Theme extraction
- Metric calculations

Integration test:

```text
API
 ↓
Service
 ↓
Repository
 ↓
Test database
```

Do not depend on live App Store/Play Store services for normal unit tests.

Use mocked collectors.

---

# 48. Collector Testing

Collectors must be independently testable.

Use mocked responses.

Example:

```text
Mock Apple response
        ↓
Apple parser
        ↓
Normalized app
```

Do not make every test call the real store.

---

# 49. Logging

Use structured logging.

Log events such as:

```text
Organization discovery started
Application discovered
Application validation failed
Review synchronization started
Reviews inserted
Reviews skipped as duplicates
Sentiment analysis completed
Collector failed
```

Do not log:

- Passwords
- API keys
- Database credentials
- Sensitive user data unnecessarily

---

# 50. Git Workflow

Use meaningful commits.

Examples:

```text
feat: initialize FastAPI backend

feat: add database configuration

feat: add organization model

feat: add application model

feat: add review model

feat: implement organization discovery

feat: implement Apple collector

feat: implement Play Store collector

feat: implement sentiment analysis

feat: add organization dashboard

test: add review deduplication tests
```

Avoid:

```text
update
changes
final
new
test
```

---

# 51. Development Phases

Implement the project in this order.

## Phase 1 — Environment

Set up:

- Python
- Node.js
- MySQL
- Git
- VS Code

Verify everything works.

---

## Phase 2 — Backend Foundation

Implement:

- FastAPI
- Configuration
- Database connection
- SQLAlchemy
- Alembic
- Health endpoint

Acceptance:

```text
GET /health
```

returns:

```json
{
  "status": "ok"
}
```

---

## Phase 3 — Database Models

Implement:

```text
Organization
App
Review
ReviewAnalysis
AppMetric
AppTheme
```

Create relationships.

Create Alembic migrations.

Acceptance:

Database schema can be created entirely using migrations.

---

## Phase 4 — Repository Layer

Implement repositories for:

```text
Organization
App
Review
Metrics
```

Add unit tests.

---

## Phase 5 — Organization Service

Implement:

```text
create/find organization
normalize organization
```

---

## Phase 6 — App Discovery

Implement:

```text
Apple collector
Google Play collector
Collector factory
App discovery service
Organization matching
Deduplication
```

Acceptance:

Entering an organization name can produce discovered applications.

---

## Phase 7 — Review Collection

Implement:

```text
Review collectors
Review normalization
Review deduplication
Incremental synchronization
Pagination
```

Acceptance:

The system can synchronize reviews without inserting duplicates.

---

## Phase 8 — Sentiment

Implement:

```text
SentimentAnalyzer interface
VADER implementation
Review analysis service
```

Acceptance:

Every new review can receive:

```text
sentiment
sentiment_score
confidence
```

---

## Phase 9 — Theme Detection

Implement initial rule/keyword-based theme extraction.

Acceptance:

The system can identify recurring themes such as:

```text
Login
Performance
Crashes
Ads
Notifications
UI/UX
Features
Payments
```

---

## Phase 10 — Metrics

Calculate:

```text
Average rating
Review count
Positive %
Neutral %
Negative %
Theme frequency
```

Store aggregated metrics.

---

## Phase 11 — React

Build:

```text
Home
Organization Dashboard
App Dashboard
Review Explorer
```

---

## Phase 12 — Charts

Add:

```text
Sentiment distribution
Sentiment trends
Rating trends
Review volume
Theme distribution
```

---

## Phase 13 — Actionable Insights

Implement rule-based insights.

Examples:

```text
Negative sentiment increased 18%.

Login complaints increased 31%.

Performance is the largest negative theme.

Android users show more negative sentiment than iOS users.
```

---

# 52. MVP Definition of Done

The MVP is considered complete when the following workflow works:

```text
1. User opens application.

2. User enters:
   Meta

3. System discovers applications.

4. System identifies:
   Instagram
   Facebook
   WhatsApp
   etc.

5. System identifies available platforms.

6. System collects reviews.

7. System avoids duplicate reviews.

8. System analyzes sentiment.

9. System identifies major themes.

10. System calculates metrics.

11. Dashboard displays organization overview.

12. User selects an application.

13. Application-specific dashboard opens.

14. User can view reviews.

15. User can compare platforms.

16. User can view sentiment trends.

17. User can see major complaints and positive themes.

18. User can manually synchronize an application.
```

---

# 53. Important MVP Limitations

Do not claim that organization discovery is guaranteed to find every application.

Discovery should be described as:

```text
Automatically discover publicly identifiable applications
associated with the organization.
```

Store availability and review access may vary by platform.

The application must handle unavailable or failed data sources gracefully.

---

# 54. Future Features

Do NOT implement these in the initial MVP unless necessary:

```text
User authentication
Role-based access
Email notifications
Slack notifications
Scheduled jobs
Redis
Celery
Kubernetes
Microservices
LLM agents
Advanced ML
Automatic release correlation
Competitor monitoring
Export to PDF
Export to Excel
```

These can become future versions.

---

# 55. Future AI Capabilities

The architecture should allow:

```text
Review
 ↓
Sentiment
 ↓
Theme
 ↓
LLM Summary
 ↓
Root Cause
 ↓
Recommendation
```

Example:

```text
Problem:
Login timeout

Impact:
42% of negative login-related reviews

Recommendation:
Prioritize authentication timeout investigation,
particularly for Android users.
```

This can become the major differentiator of the product.

---

# 56. Antigravity Development Instructions

Antigravity must follow these rules while implementing the project.

## Rule 1

Do not generate the entire application as one giant file.

---

## Rule 2

Do not place business logic inside FastAPI route handlers.

---

## Rule 3

Do not directly access SQLAlchemy models from React.

---

## Rule 4

Do not put database queries inside route handlers.

---

## Rule 5

Do not tightly couple the application to a specific review collector.

---

## Rule 6

Do not tightly couple sentiment analysis to VADER.

---

## Rule 7

Do not create duplicate database records.

---

## Rule 8

Do not store secrets in source code.

---

## Rule 9

Do not introduce unnecessary frameworks or libraries.

---

## Rule 10

Every major feature must have tests.

---

## Rule 11

Use type hints in Python.

---

## Rule 12

Use clear naming.

Prefer:

```text
ReviewService
AppDiscoveryService
SentimentAnalyzer
```

over:

```text
Helper
Manager
Utils2
DataProcessor
```

---

## Rule 13

Before implementing a new feature:

1. Inspect existing architecture.
2. Reuse existing services/repositories.
3. Avoid duplicating functionality.
4. Add tests.
5. Update documentation where necessary.

---

# 57. Antigravity Execution Strategy

Do not ask the coding agent to build everything blindly.

Use these milestones:

```text
MILESTONE 1
Environment + FastAPI + React + MySQL

MILESTONE 2
SQLAlchemy + Alembic + database models

MILESTONE 3
Repositories + services

MILESTONE 4
App discovery

MILESTONE 5
Review collection

MILESTONE 6
Sentiment

MILESTONE 7
Themes + metrics

MILESTONE 8
Dashboard

MILESTONE 9
Testing + error handling + cleanup
```

After every milestone:

```text
Run tests
Fix errors
Verify functionality
Commit changes
Proceed
```

---

# 58. Initial Environment

Backend dependencies:

```text
fastapi
uvicorn
sqlalchemy
pymysql
alembic
pydantic
pydantic-settings
httpx
python-dotenv
```

Frontend dependencies:

```text
react
react-dom
react-router-dom
axios
recharts
```

Add scraping/sentiment-specific dependencies only when implementing those features.

---

# 59. Initial Database

Create:

```sql
CREATE DATABASE app_review_intelligence
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Do not manually create application tables.

Use Alembic.

---

# 60. Initial Environment Variables

Create:

```text
backend/.env
```

Example:

```env
APP_NAME=App Review Intelligence
APP_ENV=development

DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@localhost:3306/app_review_intelligence

CORS_ORIGINS=http://localhost:5173
```

Also create:

```text
backend/.env.example
```

Never commit `.env`.

---

# 61. Initial Verification

Before implementing business logic, verify:

```text
Python works
Node works
npm works
MySQL works
Git works
FastAPI starts
React starts
Backend connects to MySQL
Frontend can communicate with backend
```

Only after all checks pass should development proceed.

---

# 62. Final Architecture

The target MVP architecture is:

```text
                         USER
                          │
                          ▼
                  ┌───────────────┐
                  │ React + Vite  │
                  └───────┬───────┘
                          │
                         HTTP
                          │
                          ▼
                  ┌───────────────┐
                  │    FastAPI    │
                  └───────┬───────┘
                          │
                  ┌───────▼────────┐
                  │   Services     │
                  │                │
                  │ Organization   │
                  │ App Discovery  │
                  │ Review         │
                  │ Sentiment      │
                  │ Theme          │
                  │ Dashboard      │
                  └───────┬────────┘
                          │
                  ┌───────▼────────┐
                  │  Repositories  │
                  └───────┬────────┘
                          │
                  ┌───────▼────────┐
                  │   SQLAlchemy   │
                  └───────┬────────┘
                          │
                  ┌───────▼────────┐
                  │     MySQL      │
                  └────────────────┘

External Stores
       │
       ├──────── Apple Collector
       │
       └──────── Google Play Collector
                       │
                       ▼
                  Review Service
```

---

# 63. Primary Product Principle

The product should not merely answer:

> "What are the ratings?"

It should answer:

> **"What are users saying, what problems are they experiencing, how serious are those problems, and which application/platform should the organization prioritize?"**

That principle should guide every feature added to the MVP.

---

# 64. First Task for Antigravity

Start ONLY with the development environment and foundation.

Tasks:

1. Create the project structure.
2. Initialize Git.
3. Create the Python virtual environment.
4. Create FastAPI application.
5. Create React/Vite application.
6. Configure MySQL connection.
7. Configure SQLAlchemy.
8. Configure Alembic.
9. Create `.env.example`.
10. Create `.gitignore`.
11. Implement `/health`.
12. Verify backend startup.
13. Verify frontend startup.
14. Verify backend → MySQL connection.
15. Add initial tests.
16. Do not implement App Store or Play Store collection yet.
17. Do not implement sentiment yet.
18. Do not implement the dashboard yet.

After this milestone is fully working, proceed to the database domain models.

---

# END OF SPECIFICATION