"""Tool de busca em destinos turísticos via RAG."""
from langchain_core.tools import tool

from app.rag import store


@tool
def buscar_destinos(query: str, pais: str | None = None) -> str:
    """
    Busca pontos turísticos, atrações e dicas de viagem na base de conhecimento
    da YouVisa usando busca semântica.

    Args:
        query: Pergunta ou tema de interesse (ex: "museus em Paris", "praias dos EUA").
        pais: Filtro opcional por país. Valores válidos: "Estados Unidos", "França",
              "Itália", "Espanha", "Portugal".

    Returns:
        String formatada com os 4 destinos mais relevantes encontrados.
    """
    resultados = store.buscar(query=query, k=4, pais=pais)
    if not resultados:
        return "Nenhum destino encontrado para essa busca."

    blocos = []
    for i, r in enumerate(resultados, 1):
        blocos.append(f"[{i}] {r['documento']}")
    return "\n\n".join(blocos)
