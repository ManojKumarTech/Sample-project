from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.app import App


class AppRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, app_id: int) -> Optional[App]:
        return self.db.query(App).filter(App.id == app_id).first()

    def get_by_organization(self, org_id: int) -> List[App]:
        return self.db.query(App).filter(App.organization_id == org_id).all()

    def find_existing(self, organization_id: int, platform: str, app_store_id: Optional[str] = None, package_name: Optional[str] = None) -> Optional[App]:
        query = self.db.query(App).filter(
            App.organization_id == organization_id,
            App.platform == platform
        )
        if app_store_id:
            res = query.filter(App.app_store_id == app_store_id).first()
            if res:
                return res
        if package_name:
            res = query.filter(App.package_name == package_name).first()
            if res:
                return res
        return None

    def create(self, **kwargs) -> App:
        app = App(**kwargs)
        self.db.add(app)
        self.db.commit()
        self.db.refresh(app)
        return app

    def update(self, app: App, **kwargs) -> App:
        for key, value in kwargs.items():
            if hasattr(app, key) and value is not None:
                setattr(app, key, value)
        self.db.commit()
        self.db.refresh(app)
        return app
