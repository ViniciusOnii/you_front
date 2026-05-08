"""
Tool para consultar processos do usuário e disparar eventos para n8n.

Os processos vivem no localStorage do front, mas o front envia o snapshot
junto com cada requisição (campo `processos_usuario` no payload), e o
backend repassa para a tool quando o usuário pergunta sobre seus vistos.
"""
import httpx
from langchain_core.tools import tool

from app.config import settings

# Estado de requisição preenchido pelo router antes de invocar o agente
_contexto_requisicao: dict = {"processos": []}


def set_contexto(processos: list[dict]):
    """Chamado pelo router para injetar o snapshot dos processos do user."""
    _contexto_requisicao["processos"] = processos or []


@tool
def consultar_meus_processos() -> str:
    """
    Consulta os processos de visto do usuário atualmente logado.
    Use quando o usuário perguntar sobre o status, prazo ou andamento dos
    vistos dele.
    """
    processos = _contexto_requisicao.get("processos", [])
    if not processos:
        return "O usuário não possui processos cadastrados ainda."

    linhas = []
    for p in processos:
        linhas.append(
            f"- Visto de {p.get('tipoVisto', '?')} | "
            f"status: {p.get('status', '?')} | "
            f"solicitado em {p.get('dataSolicitacao', '?')} | "
            f"id: {p.get('id', '?')}"
        )
    return "Processos do usuário:\n" + "\n".join(linhas)


@tool
def notificar_evento_n8n(tipo_evento: str, descricao: str) -> str:
    """
    Envia um evento para o workflow n8n via webhook.
    Use para notificar a equipe de suporte sobre interações relevantes
    (ex: usuário pediu ajuda urgente, perguntou sobre negativa, etc).

    Args:
        tipo_evento: Categoria do evento (ex: "ajuda_solicitada", "status_negado").
        descricao: Texto descritivo curto do que aconteceu.
    """
    if not settings.N8N_WEBHOOK_URL:
        return "n8n não configurado."

    try:
        with httpx.Client(timeout=5.0) as client:
            r = client.post(
                settings.N8N_WEBHOOK_URL,
                json={"tipo": tipo_evento, "descricao": descricao},
            )
            r.raise_for_status()
        return f"Evento '{tipo_evento}' enviado ao n8n com sucesso."
    except Exception as e:
        return f"Falha ao notificar n8n: {e}"
