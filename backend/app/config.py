"""Configurações centralizadas carregadas do .env."""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")

    LANGFUSE_PUBLIC_KEY: str = os.getenv("LANGFUSE_PUBLIC_KEY", "")
    LANGFUSE_SECRET_KEY: str = os.getenv("LANGFUSE_SECRET_KEY", "")
    LANGFUSE_HOST: str = os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")

    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "")

    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Modelos
    CHAT_MODEL: str = "gemini-2.0-flash-exp"
    EMBED_MODEL: str = "text-embedding-004"
    STT_MODEL: str = "whisper-large-v3-turbo"


settings = Settings()
