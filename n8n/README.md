# n8n — Automação de eventos YouVisa

Workflow que recebe eventos do agente Inho (backend Python) via webhook e
roteia para diferentes ações baseadas no tipo do evento.

## Como subir

```bash
cd n8n
docker compose up -d
```

A UI fica em http://localhost:5678 — na primeira execução o n8n pede pra
criar o usuário owner.

## Importar o workflow

1. Acesse http://localhost:5678
2. Menu lateral → **Workflows** → **Import from file**
3. Selecione `workflows/youvisa-evento.json`
4. Ative o workflow (toggle no canto superior direito)
5. O webhook fica disponível em
   `http://localhost:5678/webhook/youvisa-evento`

## Eventos suportados

O backend envia POST com payload:

```json
{
  "tipo": "ajuda_solicitada" | "status_negado",
  "descricao": "texto curto"
}
```

- **ajuda_solicitada** → roteia para o nó "Notificar Suporte"
  (placeholder, em produção integraria SendGrid/Slack)
- **status_negado** → roteia para "Abrir Ticket Negativa"
  (placeholder, em produção integraria com CRM)

## Estrutura do workflow

```
Webhook  →  Switch (por tipo)  →  Code (notificar)   →  Respond
                              \   Code (ticket)      /
```
