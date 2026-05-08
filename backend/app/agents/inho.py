"""
Agente "Inho" — assistente da YouVisa.

Implementado com LangGraph (ReAct) usando Gemini como LLM. O agente decide
sozinho quando chamar as tools de RAG, consulta de processos ou
disparo de evento n8n.
"""
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent

from app.config import settings
from app.tools.destinos import buscar_destinos
from app.tools.processos import consultar_meus_processos, notificar_evento_n8n

SYSTEM_PROMPT = """Você é Inho, um assistente virtual amigável da YouVisa, uma plataforma
brasileira de gestão de processos de visto.

Seu papel:
- Ajudar usuários a tirar dúvidas sobre vistos (turismo, estudo, trabalho, residência)
- Sugerir pontos turísticos e dicas de viagem usando a tool `buscar_destinos`
- Consultar o status dos processos do usuário com `consultar_meus_processos`
- Notificar a equipe via `notificar_evento_n8n` quando o usuário precisar de ajuda urgente
  ou tiver um processo negado

Diretrizes:
- Responda sempre em português do Brasil, tom acolhedor e profissional.
- Quando usar informação vinda da tool `buscar_destinos`, baseie a resposta nos dados
  retornados — não invente atrações que não estão no contexto.
- Seja conciso (máximo 4 parágrafos curtos).
- Se o usuário pedir guia turístico em PDF, oriente a clicar no botão correspondente
  no chat (a geração de PDF é feita no frontend).
- Use emojis com moderação (1-2 por resposta) para manter o tom acolhedor.
"""


def get_agente():
    """
    Cria um agente ReAct com as tools registradas.
    Reinstanciado a cada chamada — leve, e garante config atualizada.
    """
    llm = ChatGoogleGenerativeAI(
        model=settings.CHAT_MODEL,
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0.4,
    )
    tools = [buscar_destinos, consultar_meus_processos, notificar_evento_n8n]
    return create_react_agent(llm, tools=tools)


def responder(mensagem_usuario: str, historico: list[dict] | None = None) -> dict:
    """
    Executa uma volta do agente. Retorna a resposta final em texto, junto
    com os passos intermediários (úteis para debugging e Langfuse).
    """
    historico = historico or []

    msgs: list = [SystemMessage(content=SYSTEM_PROMPT)]
    for h in historico:
        if h["role"] == "user":
            msgs.append(HumanMessage(content=h["content"]))

    msgs.append(HumanMessage(content=mensagem_usuario))

    agente = get_agente()
    resultado = agente.invoke({"messages": msgs})

    final_msg = resultado["messages"][-1]
    return {
        "resposta": final_msg.content,
        "tools_chamadas": [
            m.name
            for m in resultado["messages"]
            if hasattr(m, "name") and m.name
        ],
    }
