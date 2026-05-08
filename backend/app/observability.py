"""
Observabilidade via Langfuse.

Cada interação com o agente vira um trace; cada chamada de LLM/tool vira
uma span dentro do trace, permitindo inspecionar latência, custo e
qualidade dos prompts no dashboard cloud.langfuse.com.
"""
from contextlib import contextmanager
from typing import Any

from langfuse import Langfuse

from app.config import settings

_lf: Langfuse | None = None


def get_langfuse() -> Langfuse | None:
    """Retorna instância singleton, ou None se credenciais não foram configuradas."""
    global _lf
    if _lf is not None:
        return _lf
    if not (settings.LANGFUSE_PUBLIC_KEY and settings.LANGFUSE_SECRET_KEY):
        return None
    _lf = Langfuse(
        public_key=settings.LANGFUSE_PUBLIC_KEY,
        secret_key=settings.LANGFUSE_SECRET_KEY,
        host=settings.LANGFUSE_HOST,
    )
    return _lf


@contextmanager
def trace(nome: str, user_id: str | None = None, **metadata: Any):
    """
    Context manager para envolver uma interação inteira.
    Sem credenciais Langfuse, vira no-op silencioso (não quebra dev local).
    """
    lf = get_langfuse()
    if lf is None:
        yield None
        return

    t = lf.trace(name=nome, user_id=user_id, metadata=metadata)
    try:
        yield t
    finally:
        lf.flush()
