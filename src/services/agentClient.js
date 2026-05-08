/**
 * Cliente HTTP para o backend Python (agente Inho).
 *
 * Faz fallback gracioso: se o backend não estiver disponível, retorna
 * { ok: false } e o componente segue com o modo rule-based legado.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const enviarMensagemAoAgente = async ({
  mensagem,
  historico = [],
  userId,
  processosUsuario = [],
}) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensagem,
        historico,
        user_id: userId,
        processos_usuario: processosUsuario,
      }),
    });

    if (!response.ok) {
      const erro = await response.text();
      return { ok: false, erro };
    }

    const data = await response.json();
    return {
      ok: true,
      resposta: data.resposta,
      toolsChamadas: data.tools_chamadas || [],
    };
  } catch (e) {
    return { ok: false, erro: e.message, offline: true };
  }
};

/**
 * Envia áudio gravado pelo MediaRecorder do browser para transcrição via
 * Groq Whisper. Retorna o texto transcrito ou erro.
 */
export const transcreverAudio = async (blob, userId) => {
  try {
    const fd = new FormData();
    fd.append('audio', blob, 'audio.webm');
    if (userId) fd.append('user_id', userId);
    const r = await fetch(`${BACKEND_URL}/transcrever`, {
      method: 'POST',
      body: fd,
    });
    if (!r.ok) {
      const erro = await r.text();
      return { ok: false, erro };
    }
    const data = await r.json();
    return { ok: true, texto: data.texto, modelo: data.modelo };
  } catch (e) {
    return { ok: false, erro: e.message, offline: true };
  }
};

export const verificarBackend = async () => {
  try {
    const r = await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
    if (!r.ok) return { online: false };
    const data = await r.json();
    return { online: true, ...data };
  } catch {
    return { online: false };
  }
};
