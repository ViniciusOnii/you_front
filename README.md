# YouVisa — Plataforma de gestão de vistos com IA Generativa

Solução completa para acompanhamento de processos de visto, integrada com um
agente de IA chamado **Inho** capaz de tirar dúvidas, buscar informações
turísticas (RAG) e disparar fluxos de automação.

> 📄 **Documento técnico completo:** [`docs/CP5_Documento_Tecnico.md`](docs/CP5_Documento_Tecnico.md)

## Estrutura

```
you_front/
├── src/             Frontend React + Vite + Tailwind
├── backend/         API FastAPI + agente LangGraph + RAG + Langfuse
├── n8n/             Workflow Docker para automação de eventos
└── docs/            Documentação técnica (CP5)
```

## Como rodar

### 1) Frontend
```bash
npm install
npm run dev    # http://localhost:5173
```

### 2) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # preencher GOOGLE_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 3) n8n
```bash
cd n8n
docker compose up -d       # http://localhost:5678
# importar workflows/youvisa-evento.json
```

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS, jsPDF
- **Backend**: Python 3.11, FastAPI, Pydantic
- **GenAI**: Gemini 2.0 Flash, text-embedding-004, LangGraph, ChromaDB
- **Observabilidade**: Langfuse Cloud
- **Automação**: n8n (Docker)

## Arquitetura

Frontend ↔ Backend FastAPI ↔ Agente LangGraph (RAG + tools) ↔ n8n / Langfuse

Veja [`docs/CP5_Documento_Tecnico.md`](docs/CP5_Documento_Tecnico.md) para
detalhes completos.

## Login de teste (frontend)

- `joao@youvisa.com` / `123456`
- `maria@youvisa.com` / `senha123`
- `pedro@youvisa.com` / `pedro2025`
