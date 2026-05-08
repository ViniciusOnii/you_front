"""
RAG (Retrieval-Augmented Generation) sobre a base de pontos turísticos.

Usa ChromaDB persistente local + embeddings text-embedding-004 do Google.
Cada ponto turístico é um chunk (granularidade ideal para esse tamanho de
conteúdo — chunks muito grandes diluem o sinal).
"""
import json
from pathlib import Path
from typing import Any

import chromadb
from chromadb.config import Settings as ChromaSettings
from google import genai

from app.config import settings

KB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "knowledge_base.json"
PERSIST_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "chroma"
COLLECTION = "youvisa_destinos"


def _client() -> genai.Client:
    return genai.Client(api_key=settings.GOOGLE_API_KEY)


def _embed(textos: list[str]) -> list[list[float]]:
    """Gera embeddings em lote usando text-embedding-004 (768 dimensões)."""
    resp = _client().models.embed_content(
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


def _get_collection():
    client = chromadb.PersistentClient(
        path=str(PERSIST_DIR),
        settings=ChromaSettings(anonymized_telemetry=False),
    )
    return client.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"},
    )


def indexar() -> int:
    """
    Lê knowledge_base.json, gera embeddings e popula a coleção do Chroma.
    Idempotente — se a coleção já tem o mesmo número de itens, pula.
    """
    items = json.loads(KB_PATH.read_text(encoding="utf-8"))
    coll = _get_collection()

    if coll.count() == len(items):
        return coll.count()

    # Reseta para garantir consistência se a base mudou
    if coll.count() > 0:
        coll.delete(ids=coll.get()["ids"])

    docs = [_chunk_para_texto(it) for it in items]
    ids = [f"dst-{i:04d}" for i in range(len(items))]
    metadatas = [
        {"pais": it["pais"], "cidade": it["cidade"], "categoria": it["categoria"]}
        for it in items
    ]

    embeddings = _embed(docs)
    coll.add(ids=ids, documents=docs, metadatas=metadatas, embeddings=embeddings)
    return coll.count()


def buscar(query: str, k: int = 4, pais: str | None = None) -> list[dict[str, Any]]:
    """
    Busca semântica por similaridade de cosseno. Aceita filtro opcional por país.
    Retorna lista de {documento, metadados, distancia}.
    """
    coll = _get_collection()
    if coll.count() == 0:
        indexar()

    where = {"pais": pais} if pais else None
    embedding = _embed([query])[0]

    res = coll.query(
        query_embeddings=[embedding],
        n_results=k,
        where=where,
    )

    return [
        {
            "documento": doc,
            "metadados": meta,
            "distancia": dist,
        }
        for doc, meta, dist in zip(
            res["documents"][0],
            res["metadatas"][0],
            res["distances"][0],
        )
    ]
