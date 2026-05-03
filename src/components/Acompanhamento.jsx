import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProcessos, getStatusLabel } from '../context/ProcessosContext';

// Mapeia o status do processo para um % de progresso e a etapa "atual"
const progressoPorStatus = {
  aguardando_docs: { progresso: 20, etapaAtual: 1 },
  em_analise: { progresso: 60, etapaAtual: 2 },
  agendado: { progresso: 75, etapaAtual: 3 },
  aprovado: { progresso: 100, etapaAtual: 4 },
  negado: { progresso: 100, etapaAtual: 4 },
};

const Acompanhamento = () => {
  const { user } = useAuth();
  const { processos } = useProcessos();
  const [selecionadoId, setSelecionadoId] = useState(null);

  // Seleciona o primeiro processo quando a lista carrega/muda
  useEffect(() => {
    if (processos.length > 0 && !processos.find((p) => p.id === selecionadoId)) {
      setSelecionadoId(processos[0].id);
    }
    if (processos.length === 0) {
      setSelecionadoId(null);
    }
  }, [processos, selecionadoId]);

  const processo = useMemo(
    () => processos.find((p) => p.id === selecionadoId),
    [processos, selecionadoId]
  );

  // Documentos (mock — viriam de uma API em produção)
  const documentos = [
    { id: 1, nome: 'Passaporte.pdf', tamanho: '2.4 MB', status: 'aprovado' },
    { id: 2, nome: 'Comprovante_Residencia.pdf', tamanho: '1.8 MB', status: 'aprovado' },
    { id: 3, nome: 'Comprovante_Financeiro.pdf', tamanho: '3.2 MB', status: 'aprovado' },
    { id: 4, nome: 'Foto_3x4.jpg', tamanho: '856 KB', status: 'aprovado' },
  ];

  const containerStyle = {
    background: 'linear-gradient(135deg, #00A884 0%, #00C299 100%)',
  };

  const getStatusColor = (status) => {
    const colors = {
      concluido: 'bg-green-500',
      em_andamento: 'bg-youvisa-green',
      pendente: 'bg-gray-300',
    };
    return colors[status] || 'bg-gray-300';
  };

  // Se não há processo selecionado, exibe estado vazio
  if (!processo) {
    return (
      <div className="pt-20 bg-gray-50 min-h-screen animate-fade-in">
        <section style={containerStyle} className="py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Acompanhe seu Visto
            </h1>
            <p className="text-white/90 text-lg">
              Selecione um processo para ver os detalhes.
            </p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-youvisa-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-youvisa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-youvisa-gray mb-2">
              Você ainda não tem processos para acompanhar
            </h3>
            <p className="text-gray-500">
              Cadastre uma solicitação em <strong>Processos</strong> para começar o acompanhamento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Gera protocolo a partir do id do processo
  const protocolo = `YV-${new Date().getFullYear()}-${processo.id.slice(-6).toUpperCase()}`;
  const { progresso, etapaAtual } = progressoPorStatus[processo.status] || {
    progresso: 10,
    etapaAtual: 0,
  };

  // Timeline derivada do status
  const etapas = [
    {
      id: 1,
      titulo: 'Solicitação Recebida',
      descricao: 'Sua solicitação foi recebida e registrada',
      data: processo.dataSolicitacao,
      icone: '📝',
    },
    {
      id: 2,
      titulo: 'Documentos Enviados',
      descricao: 'Todos os documentos foram recebidos',
      data: etapaAtual >= 1 ? processo.dataSolicitacao : null,
      icone: '📋',
    },
    {
      id: 3,
      titulo: 'Em Análise',
      descricao: 'Nossos especialistas estão analisando seu processo',
      data: etapaAtual >= 2 ? processo.dataSolicitacao : null,
      icone: '🔍',
    },
    {
      id: 4,
      titulo: 'Agendamento de Entrevista',
      descricao: 'Aguardando disponibilidade no consulado',
      data: etapaAtual >= 3 ? processo.dataSolicitacao : null,
      icone: '📅',
    },
    {
      id: 5,
      titulo: processo.status === 'negado' ? 'Visto Negado' : 'Visto Aprovado',
      descricao:
        processo.status === 'negado'
          ? 'O consulado negou o visto'
          : 'Seu visto foi aprovado pelo consulado',
      data: etapaAtual >= 4 ? processo.dataSolicitacao : null,
      icone: processo.status === 'negado' ? '❌' : '✅',
    },
  ].map((e) => ({
    ...e,
    status:
      e.id < etapaAtual + 1 ? 'concluido' : e.id === etapaAtual + 1 ? 'em_andamento' : 'pendente',
  }));

  return (
    <div className="pt-20 bg-gray-50 min-h-screen animate-fade-in">
      {/* Header com informações do processo */}
      <section style={containerStyle} className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-white">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Acompanhe seu Visto
                </h1>
                <p className="text-white/90 text-lg">
                  Protocolo: <span className="font-semibold">{protocolo}</span>
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
                <p className="text-sm text-white/80 mb-1">Status</p>
                <p className="text-xl font-bold">{getStatusLabel(processo.status)}</p>
              </div>
            </div>

            {/* Seletor de processo (se houver mais de um) */}
            {processos.length > 1 && (
              <div className="mb-6 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <label className="text-sm text-white/80 block mb-2">
                  Selecione o processo
                </label>
                <select
                  value={selecionadoId || ''}
                  onChange={(e) => setSelecionadoId(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 rounded-lg text-youvisa-gray font-medium bg-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {processos.map((p) => (
                    <option key={p.id} value={p.id}>
                      Visto de {p.tipoVisto} · {getStatusLabel(p.status)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Barra de Progresso */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Progresso do Processo</span>
                <span className="text-sm font-bold">{progresso}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                  role="progressbar"
                  aria-valuenow={progresso}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-youvisa-gray mb-6">
                Linha do Tempo
              </h2>

              <div className="space-y-8">
                {etapas.map((etapa, index) => (
                  <div key={etapa.id} className="relative">
                    {index < etapas.length - 1 && (
                      <div
                        className={`absolute left-6 top-12 w-0.5 h-16 ${
                          etapa.status === 'concluido' ? 'bg-youvisa-green' : 'bg-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    <div className="flex items-start space-x-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full ${getStatusColor(
                          etapa.status
                        )} flex items-center justify-center text-2xl`}
                        aria-hidden="true"
                      >
                        {etapa.icone}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="text-lg font-semibold text-youvisa-gray">
                            {etapa.titulo}
                          </h3>
                          {etapa.status === 'concluido' && (
                            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                              Concluído
                            </span>
                          )}
                          {etapa.status === 'em_andamento' && (
                            <span className="text-xs bg-youvisa-green/10 text-youvisa-green px-3 py-1 rounded-full font-medium">
                              Em andamento
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{etapa.descricao}</p>
                        {etapa.data && (
                          <p className="text-sm text-gray-500 mt-2">
                            📅 {etapa.data}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Informações */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-youvisa-gray mb-4">
                Informações do Visto
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Titular</p>
                  <p className="font-semibold text-youvisa-gray">
                    {user?.nome || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tipo de Visto</p>
                  <p className="font-semibold text-youvisa-gray">{processo.tipoVisto}</p>
                </div>
                <div>
                  <p className="text-gray-500">Data da Solicitação</p>
                  <p className="font-semibold text-youvisa-gray">
                    {processo.dataSolicitacao}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">ID do processo</p>
                  <p className="font-mono text-xs text-youvisa-gray break-all">
                    {processo.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Card de Documentos */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-youvisa-gray mb-4">
                Documentos Enviados
              </h3>
              <div className="space-y-3">
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-8 h-8 text-youvisa-green"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-youvisa-gray">
                          {doc.nome}
                        </p>
                        <p className="text-xs text-gray-500">{doc.tamanho}</p>
                      </div>
                    </div>
                    {doc.status === 'aprovado' && (
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="Documento aprovado"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-youvisa-green/10 text-youvisa-green px-4 py-3 rounded-lg font-semibold hover:bg-youvisa-green hover:text-white transition-all duration-200">
                + Adicionar Documento
              </button>
            </div>

            {/* Card de Contato */}
            <div className="bg-youvisa-green rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Precisa de Ajuda?</h3>
              <p className="text-sm text-white/90 mb-4">
                Nossa equipe está pronta para ajudar você!
              </p>
              <button className="w-full bg-white text-youvisa-green px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acompanhamento;
