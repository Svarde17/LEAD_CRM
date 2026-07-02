from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from app.core.config import settings
from app.api import auth, leads, followups, ai
from app.jobs.scheduler import send_daily_reminders


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_daily_reminders, "cron", hour=8, minute=0)
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="LeadVault API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(followups.router)
app.include_router(ai.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/admin/trigger-reminders", tags=["Admin"])
def trigger_reminders():
    send_daily_reminders()
    return {"status": "reminders sent"}


@app.post("/admin/test-email", tags=["Admin"])
def test_email(to: str):
    from app.jobs.email_service import send_followup_reminder
    send_followup_reminder(
        to_email=to,
        user_name="Test User",
        followups=[{"title": "Call client", "lead_name": "John Doe", "company": "Acme Corp"}],
    )
    return {"status": f"test email sent to {to}"}
