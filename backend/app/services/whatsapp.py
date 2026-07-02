from twilio.rest import Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


def send_whatsapp(to_phone: str, message: str) -> str:
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    logger.info(f"Sending WhatsApp to: whatsapp:{to_phone} from: {settings.TWILIO_WHATSAPP_FROM}")
    msg = client.messages.create(
        from_=settings.TWILIO_WHATSAPP_FROM,
        to=f"whatsapp:{to_phone}",
        body=message,
    )
    logger.info(f"Twilio SID: {msg.sid} | Status: {msg.status}")
    return msg.sid
