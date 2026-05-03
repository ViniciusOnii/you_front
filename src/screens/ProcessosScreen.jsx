import { useMemo, useState } from 'react';
import {
  useProcessos,
  getStatusLabel,
  TIPOS_VISTO,
  STATUS_PROCESSO,
} from '../context/ProcessosContext';
import ConfirmDialog from '../components/ConfirmDialog';

const cardStatusStyle = {
  aguardando_docs: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  em_analise: 'bg-blue-100 text-blue-800 border-blue-200',
  agendado: 'bg-purple-100 text-purple-800 border-purple-200',
  aprovado: 'bg-green-100 text-green-800 border-green-200',
  negado: 'bg-red-100 text-red-800 border-red-200',
};

const barraCor = {
  aguardando_docs: 'bg-yellow-400',
  em_analise: 'bg-blue-500',
  agendado: 'bg-purple-500',
  aprovado: 'bg-green-500',
  negado: 'bg-red-500',
};

const ProcessosScreen = () => {
  const { processos, criarProcesso, atualizarProcesso, removerProcesso } = useProcessos();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [tipoVisto, setTipoVisto] = useState(TIPOS_VISTO[0]);
  const [status, setStatus] = useState('aguardando_docs');
  const [filtro, setFiltro] = useState('todos');
  const [toast, setToast] = useState(null);
  const [confirmarRemocao, setConfirmarRemocao] = useState(null);

  const mostrarToast = (texto, variante = 'success') => {
    setToast({ texto, variante });
    setTimeout(() => setToast(null), 2500);
  };

  const handleCriar = (e) => {
    e.preventDefault();
    criarProcesso({ tipoVisto, status });
    setTipoVisto(TIPOS_VISTO[0]);
    setStatus('aguardando_docs');
    setMostrarForm(false);
    mostrarToast('Solicitação criada com sucesso!');
  };

  const handleRemover = () => {
    if (!confirmarRemocao) return;
    removerProcesso(confirmarRemocao.id);
    setConfirmarRemocao(null);
    mostrarToast('Solicitação removida.', 'info');
  };

  const processosFiltrados = useMemo(() => {
    if (filtro === 'todos') return processos;
    return processos.filter((p) => p.status === filtro);
  }, [processos, filtro]);

  return (
    <div className="pt-20 bg-gray-50 min-h-screen animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-br from-youvisa-green to-youvisa-green-light py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-white flex items-center justify-between flex-wrap gap-4 relative">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Meus Processos</h1>
            <p className="text-white/90 text-lg">
              Gerencie suas solicitações de visto
            </p>
          </div>
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="bg-white text-youvisa-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md flex items-center space-x-2"
          >
            {mostrarForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nova Solicitação</span>
              </>
            )}
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Formulário de criação */}
        {mostrarForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 animate-fade-in border-l-4 border-youvisa-green">
            <h2 className="text-xl font-bold text-youvisa-gray mb-4">
              Nova Solicitação de Visto
            </h2>
            <form onSubmit={handleCriar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="tipoVisto"
                  className="block text-sm font-medium text-youvisa-gray mb-2"
                >
                  Tipo de Visto
                </label>
                <select
                  id="tipoVisto"
                  value={tipoVisto}
                  onChange={(e) => setTipoVisto(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-youvisa-green bg-white"
                >
                  {TIPOS_VISTO.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-youvisa-gray mb-2"
                >
                  Status inicial
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-youvisa-green bg-white"
                >
                  {STATUS_PROCESSO.map((s) => (
                    <option key={s.valor} value={s.valor}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-youvisa-green text-white py-3 rounded-lg font-semibold hover:bg-youvisa-green-light transition-colors shadow-sm hover:shadow-md"
                >
                  Criar solicitação
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros */}
        {processos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterChip
              ativo={filtro === 'todos'}
              onClick={() => setFiltro('todos')}
              label={`Todos (${processos.length})`}
            />
            {STATUS_PROCESSO.map((s) => {
              const count = processos.filter((p) => p.status === s.valor).length;
              if (count === 0) return null;
              return (
                <FilterChip
                  key={s.valor}
                  ativo={filtro === s.valor}
                  onClick={() => setFiltro(s.valor)}
                  label={`${s.label} (${count})`}
                />
              );
            })}
          </div>
        )}

        {/* Lista de processos */}
        {processos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-youvisa-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-youvisa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-youvisa-gray mb-2">
              Nenhuma solicitação cadastrada
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando sua primeira solicitação de visto.
            </p>
            <button
              onClick={() => setMostrarForm(true)}
              className="bg-youvisa-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-youvisa-green-light transition-colors shadow-sm hover:shadow-md"
            >
              + Criar primeira solicitação
            </button>
          </div>
        ) : processosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">Nenhum processo encontrado neste filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processosFiltrados.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className={`h-1 ${barraCor[p.status] || 'bg-gray-300'}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-youvisa-green/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-youvisa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <button
                      onClick={() =>
                        setConfirmarRemocao({ id: p.id, tipo: p.tipoVisto })
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label={`Remover solicitação ${p.tipoVisto}`}
                      title="Remover"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="font-bold text-youvisa-gray mb-1">
                    Visto de {p.tipoVisto}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    📅 {p.dataSolicitacao}
                  </p>

                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={p.status}
                    onChange={(e) => {
                      atualizarProcesso(p.id, { status: e.target.value });
                      mostrarToast('Status atualizado.');
                    }}
                    className={`w-full text-sm px-3 py-2 rounded-lg font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-youvisa-green ${
                      cardStatusStyle[p.status] || 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                    aria-label={`Status de ${p.tipoVisto}`}
                  >
                    {STATUS_PROCESSO.map((s) => (
                      <option key={s.valor} value={s.valor}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  <p className="text-xs text-gray-400 mt-3 font-mono truncate">
                    ID: {p.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-lg shadow-lg text-white font-medium flex items-center space-x-2 animate-fade-in ${
            toast.variante === 'info' ? 'bg-youvisa-gray' : 'bg-youvisa-green'
          }`}
          role="status"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toast.texto}</span>
        </div>
      )}

      {/* Modal de confirmação */}
      <ConfirmDialog
        aberto={!!confirmarRemocao}
        titulo="Remover solicitação?"
        mensagem={`Tem certeza que deseja remover a solicitação de visto de ${confirmarRemocao?.tipo}? Esta ação não pode ser desfeita.`}
        textoConfirmar="Sim, remover"
        textoCancelar="Cancelar"
        variante="danger"
        onConfirmar={handleRemover}
        onCancelar={() => setConfirmarRemocao(null)}
      />
    </div>
  );
};

const FilterChip = ({ ativo, onClick, label }) => (
  <button
    onClick={onClick}
    className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${
      ativo
        ? 'bg-youvisa-green text-white shadow-sm'
        : 'bg-white text-youvisa-gray border border-gray-200 hover:border-youvisa-green'
    }`}
  >
    {label}
  </button>
);

export default ProcessosScreen;
