from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def transcribe_audio(audio_bytes: bytes, filename: str = "recording.webm") -> str:
    transcript = client.audio.transcriptions.create(
        model="whisper-large-v3-turbo",
        file=(filename, audio_bytes),
    )
    return transcript.text
