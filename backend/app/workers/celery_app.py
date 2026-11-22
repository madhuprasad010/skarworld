import os
from celery import Celery
from app.core.config import settings

redis_url = settings.REDIS_URL or os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "skarworld_workers",
    broker=redis_url,
    backend=redis_url,
    include=[
        "app.workers.tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
    worker_prefetch_multiplier=1,
)

if __name__ == "__main__":
    celery_app.start()
