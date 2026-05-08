"""
RAG (Retrieval-Augmented Generation) sobre a base de pontos turísticos.

Usa Qdrant como vector store + embeddings text-embedding-004 do Google.
Modo padrão: client local persistente (Qdrant rodando em ./data/qdrant_storage).
Pode ser apontado para Qdrant Cloud via QDRANT_URL + QDRANT_API_KEY no .env.

Cada ponto turístico é um chunk (granularidade ideal para esse tamanho de
conteúdo — chunks muito grandes diluem o sinal).
"""
import json
import os
from pathlib import Path
from typing import Any

from google import genai
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

from app.config import settings

KB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "knowledge_base.json"
PERSIST_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "qdrant_storage"
COLLECTION = "youvisa_destinos"
VECTOR_DIM = 768  # text-embedding-004


def _gemini() -> genai.Client:
    return genai.Client(api_key=settings.GOOGLE_API_KEY)


def _qdrant() -> QdrantClient:
    """
    Retorna client Qdrant. Se QDRANT_URL estiver setado no .env, usa Qdrant Cloud;
    caso contrário, usa modo local persistente (arquivos em data/qdrant_storage/).
    """
    url = os.getenv("QDRANT_URL")
    api_key = os.getenv("QDRANT_API_KEY")
    if url:
        return QdrantClient(url=url, api_key=api_key)
    return QdrantClient(path=str(PERSIST_DIR))


def _embed(textos: list[str]) -> list[list[float]]:
    """Gera embeddings em lote usando text-embedding-004 (768 dimensões)."""
    resp = _gemini().models.embed_content(
        model=settings.EMBED_MODEL,
        contents=textos,
    )
    return [e.values for e in resp.embeddings]


def _chunk_para_texto(item: dict[str, Any]) -> str:
    """
    Concatena os campos relevantes em um documento textual usado tanto para
    o embedding quanto como contexto retornado ao LLM.
    """
    return (
        f"Destino: {item['atracao']} ({item['cidade']}, {item['pais']})\n"
        f"Categoria: {item['categoria']}\n"
        f"Descrição: {item['descricao']}\n"
        f"Dica: {item['dica']}"
    )


def _ensure_collection(client: QdrantClient):
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=VECTOR_DIM, distance=Distance.COSINE),
        )


def indexar() -> int:
    """
    Lê knowledge_base.json, gera embeddings e popula a coleção do Qdrant.
    Idempotente — se a coleção já tem o mesmo número de itens, pula.
    """
    items = json.loads(KB_PATH.read_text(encoding="utf-8"))
    client = _qdrant()
    _ensure_collection(client)

    info = client.get_collection(COLLECTION)
    if info.points_count == len(items):
        return info.points_count

    # Reseta para garantir consistência se a base mudou
    client.delete_collection(COLLECTION)
    _ensure_collection(client)

    docs = [_chunk_para_texto(it) for it in items]
    embeddings = _embed(docs)

    pontos = [
        PointStruct(
            id=i,
            vector=emb,
            payload={
                "documento": doc,
                "pais": items[i]["pais"],
                "cidade": items[i]["cidade"],
                "categoria": items[i]["categoria"],
            },
        )
        for i, (doc, emb) in enumerate(zip(docs, embeddings))
    ]
    client.upsert(collection_name=COLLECTION, points=pontos)

    return client.get_collection(COLLECTION).points_count


def buscar(query: str, k: int = 4, pais: str | None = None) -> list[dict[str, Any]]:
    """
    Busca semântica por similaridade de cosseno. Aceita filtro opcional por país.
    Retorna lista de {documento, metadados, score}.
    """
    client = _qdrant()
    _ensure_collection(client)

    if client.get_collection(COLLECTION).points_count == 0:
        indexar()

    query_filter = None
    if pais:
        query_filter = Filter(
            must=[FieldCondition(key="pais", match=MatchValue(value=pais))]
        )

    embedding = _embed([query])[0]
    res = client.query_points(
        collection_name=COLLECTION,
        query=embedding,
        query_filter=query_filter,
        limit=k,
    )

    return [
        {
            "documento": p.payload["documento"],
            "metadados": {
                "pais": p.payload.get("pais"),
                "cidade": p.payload.get("cidade"),
                "categoria": p.payload.get("categoria"),
            },
            "score": p.score,
        }
        for p in res.points
    ]
