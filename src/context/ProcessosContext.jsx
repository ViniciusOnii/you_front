import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const ProcessosContext = createContext(null);

const STORAGE_PREFIX = 'youvisa:processos:';

const hoje = () => {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
};

const gerarId = () => `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const TIPOS_VISTO = [
  'Turismo',
  'Negócios',
  'Estudo',
  'Trabalho',
  'Residência',
];

export const STATUS_PROCESSO = [
  { valor: 'aguardando_docs', label: 'Aguardando Documentos' },
  { valor: 'em_analise', label: 'Em Análise' },
  { valor: 'agendado', label: 'Entrevista Agendada' },
  { valor: 'aprovado', label: 'Aprovado' },
  { valor: 'negado', label: 'Negado' },
];

export const ProcessosProvider = ({ children }) => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState([]);

  const storageKey = user ? `${STORAGE_PREFIX}${user.id}` : null;

  // Carrega os processos do usuário quando o user muda
  useEffect(() => {
    if (!storageKey) {
      setProcessos([]);
      return;
    }
    try {
      const salvo = localStorage.getItem(storageKey);
      setProcessos(salvo ? JSON.parse(salvo) : []);
    } catch {
      setProcessos([]);
    }
  }, [storageKey]);

  // Persiste sempre que processos ou usuário mudam
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(processos));
  }, [processos, storageKey]);

  const criarProcesso = useCallback(({ tipoVisto, status = 'aguardando_docs', dataSolicitacao }) => {
    const novo = {
      id: gerarId(),
      tipoVisto,
      status,
      dataSolicitacao: dataSolicitacao || hoje(),
    };
    setProcessos((prev) => [novo, ...prev]);
    return novo;
  }, []);

  const atualizarProcesso = useCallback((id, patch) => {
    setProcessos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removerProcesso = useCallback((id) => {
    setProcessos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      processos,
      criarProcesso,
      atualizarProcesso,
      removerProcesso,
    }),
    [processos, criarProcesso, atualizarProcesso, removerProcesso]
  );

  return <ProcessosContext.Provider value={value}>{children}</ProcessosContext.Provider>;
};

export const useProcessos = () => {
  const ctx = useContext(ProcessosContext);
  if (!ctx) throw new Error('useProcessos deve ser usado dentro de <ProcessosProvider>');
  return ctx;
};

export const getStatusLabel = (valor) =>
  STATUS_PROCESSO.find((s) => s.valor === valor)?.label || 'Processando';
