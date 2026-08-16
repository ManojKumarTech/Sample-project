from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_discovery_and_app_flow():
    # 1. Discover organization
    discover_resp = client.post("/api/organizations/discover", json={"name": "Meta"})
    assert discover_resp.status_code == 200
    data = discover_resp.json()
    assert "organization_id" in data
    assert data["name"] == "Meta"
    org_id = data["organization_id"]

    # 2. Get organization
    org_resp = client.get(f"/api/organizations/{org_id}")
    assert org_resp.status_code == 200

    # 3. Get apps
    apps_resp = client.get(f"/api/organizations/{org_id}/apps")
    assert apps_resp.status_code == 200
    apps = apps_resp.json()
    assert len(apps) > 0
    first_app = apps[0]
    app_id = first_app["id"]

    # 4. Sync reviews for first app
    sync_resp = client.post(f"/api/apps/{app_id}/sync?limit=20")
    assert sync_resp.status_code == 200
    sync_data = sync_resp.json()
    assert sync_data["app_id"] == app_id

    # 5. Get app reviews
    reviews_resp = client.get(f"/api/apps/{app_id}/reviews?page=1&page_size=10")
    assert reviews_resp.status_code == 200
    reviews_data = reviews_resp.json()
    assert "items" in reviews_data
    assert reviews_data["total"] >= 0

    # 6. Get app dashboard
    app_dash_resp = client.get(f"/api/apps/{app_id}")
    assert app_dash_resp.status_code == 200
    app_dash = app_dash_resp.json()
    assert "metrics" in app_dash
    assert "sentiment_distribution" in app_dash

    # 7. Get organization dashboard
    org_dash_resp = client.get(f"/api/organizations/{org_id}/dashboard")
    assert org_dash_resp.status_code == 200
    org_dash = org_dash_resp.json()
    assert org_dash["organization_id"] == org_id
    assert "apps_comparison" in org_dash
    assert "insights" in org_dash
