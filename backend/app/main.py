"""Entry point FastAPI."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.rag import store
from app.routers import chat


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Indexação inicial do RAG (idempotente)
    if settings.GOOGLE_API_KEY:
        try:
            n = store.indexar()
            print(f"[RAG] {n} destinos indexados no ChromaDB.")
        except Exception as e:
            print(f"[RAG] Falha na indexação inicial: {e}")
    yield


app = FastAPI(
    title="YouVisa Backend",
    version="1.0.0",
    description="API do agente Inho com RAG, tools e observabilidade.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, tags=["chat"])


@app.get("/health")
def health():
    return {
        "status": "ok",
        "modelos": {"chat": settings.CHAT_MODEL, "embed": settings.EMBED_MODEL},
        "langfuse_ativo": bool(settings.LANGFUSE_PUBLIC_KEY),
        "n8n_configurado": bool(settings.N8N_WEBHOOK_URL),
    }
