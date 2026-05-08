"""Endpoint principal de chat com o agente."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.agents.inho import responder
from app.observability import trace
from app.tools.processos import set_contexto

router = APIRouter()


class Mensagem(BaseModel):
    role: str = Field(..., description="user ou assistant")
    content: str


class ProcessoSnapshot(BaseModel):
    id: str
    tipoVisto: str
    status: str
    dataSolicitacao: str


class ChatRequest(BaseModel):
    mensagem: str
    historico: list[Mensagem] = []
    user_id: str | None = None
    processos_usuario: list[ProcessoSnapshot] = []


class ChatResponse(BaseModel):
    resposta: str
    tools_chamadas: list[str]


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.mensagem.strip():
        raise HTTPException(400, "mensagem vazia")

    # Injeta o contexto de processos antes de invocar o agente
    set_contexto([p.model_dump() for p in req.processos_usuario])

    with trace(
        "chat_inho",
        user_id=req.user_id,
        msg_len=len(req.mensagem),
        n_processos=len(req.processos_usuario),
    ):
        try:
            resultado = responder(
                mensagem_usuario=req.mensagem,
                historico=[m.model_dump() for m in req.historico],
            )
        except Exception as e:
            raise HTTPException(500, f"Erro no agente: {e}")

    return ChatResponse(**resultado)
