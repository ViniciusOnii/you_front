"""
Endpoint de transcrição de áudio.

Recebe um arquivo de áudio (gravado pelo usuário no chatbot) e usa
o modelo Whisper Large v3 Turbo via Groq Cloud para transcrever em
português. Groq foi escolhido por:
- Inferência muito rápida (latência de ~300ms para áudios curtos)
- Free tier suficiente para demonstração
- Compatível com formatos webm/ogg/mp3/wav que o navegador grava nativamente

A transcrição é então enviada como mensagem de texto para o agente Inho,
fechando o ciclo de multimodalidade de entrada (voz → texto → resposta).
"""
import io

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.config import settings
from app.observability import trace

router = APIRouter()


class TranscricaoResponse(BaseModel):
    texto: str
    modelo: str
    duracao_segundos: float | None = None


@router.post("/transcrever", response_model=TranscricaoResponse)
async def transcrever(audio: UploadFile = File(...), user_id: str | None = None):
    if not settings.GROQ_API_KEY:
        raise HTTPException(503, "GROQ_API_KEY não configurada no servidor")

    conteudo = await audio.read()
    if not conteudo:
        raise HTTPException(400, "Arquivo de áudio vazio")

    # Import dinâmico para o servidor não falhar caso o pacote não esteja instalado
    from groq import Groq

    client = Groq(api_key=settings.GROQ_API_KEY)

    with trace("stt_groq", user_id=user_id, bytes=len(conteudo)):
        try:
            resp = client.audio.transcriptions.create(
                file=(audio.filename or "audio.webm", io.BytesIO(conteudo)),
                model=settings.STT_MODEL,
                language="pt",
                response_format="verbose_json",
            )
        except Exception as e:
            raise HTTPException(500, f"Falha na transcrição: {e}")

    texto = getattr(resp, "text", "") or ""
    duracao = getattr(resp, "duration", None)

    return TranscricaoResponse(
        texto=texto.strip(),
        modelo=settings.STT_MODEL,
        duracao_segundos=duracao,
    )
