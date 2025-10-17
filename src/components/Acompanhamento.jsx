import { useState } from 'react';

const Acompanhamento = () => {
  // Dados mockados do cliente (em produção viria de uma API)
  const [processoData] = useState({
    protocolo: 'YV-2025-001234',
    cliente: {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '+55 11 98765-4321',
    },
    visto: {
      tipo: 'Turismo',
      pais: 'Estados Unidos',
      dataSolicitacao: '15/01/2025',
      dataPrevisao: '15/02/2025',
    },
    status: 'em_analise', // aguardando_docs, em_analise, agendado, aprovado, negado
    progresso: 60, // 0-100%
  });

  // Timeline de etapas
  const etapas = [
    {
      id: 1,
      titulo: 'Solicitação Recebida',
      descricao: 'Sua solicitação foi recebida e registrada',
      data: '15/01/2025 14:30',
      status: 'concluido',
      icone: '📝',
    },
    {
      id: 2,
      titulo: 'Documentos Enviados',
      descricao: 'Todos os documentos foram recebidos',
      data: '16/01/2025 10:15',
      status: 'concluido',
      icone: '📋',
    },
    {
      id: 3,
      titulo: 'Em Análise',
      descricao: 'Nossos especialistas estão analisando seu processo',
      data: '17/01/2025 09:00',
      status: 'em_andamento',
      icone: '🔍',
    },
    {
      id: 4,
      titulo: 'Agendamento de Entrevista',
      descricao: 'Aguardando disponibilidade no consulado',
      data: null,
      status: 'pendente',
      icone: '📅',
    },
    {
      id: 5,
      titulo: 'Visto Aprovado',
      descricao: 'Seu visto foi aprovado pelo consulado',
      data: null,
      status: 'pendente',
      icone: '✅',
    },
  ];

  // Documentos do processo
  const documentos = [
    { id: 1, nome: 'Passaporte.pdf', tamanho: '2.4 MB', status: 'aprovado' },
    { id: 2, nome: 'Comprovante_Residencia.pdf', tamanho: '1.8 MB', status: 'aprovado' },
    { id: 3, nome: 'Comprovante_Financeiro.pdf', tamanho: '3.2 MB', status: 'aprovado' },
    { id: 4, nome: 'Foto_3x4.jpg', tamanho: '856 KB', status: 'aprovado' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      concluido: 'bg-green-500',
      em_andamento: 'bg-youvisa-green',
      pendente: 'bg-gray-300',
    };
    return colors[status] || 'bg-gray-300';
  };

  const getStatusText = (status) => {
    const texts = {
      aguardando_docs: 'Aguardando Documentos',
      em_analise: 'Em Análise',
      agendado: 'Entrevista Agendada',
      aprovado: 'Aprovado',
      negado: 'Negado',
    };
    return texts[status] || 'Processando';
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Header com informações do processo */}
      <section className="py-12 bg-gradient-to-br from-youvisa-green to-[#00C299]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Acompanhe seu Visto
                </h1>
                <p className="text-white/90 text-lg">
                  Protocolo: <span className="font-semibold">{processoData.protocolo}</span>
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
                  <p className="text-sm text-white/80 mb-1">Status</p>
                  <p className="text-xl font-bold">{getStatusText(processoData.status)}</p>
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Progresso do Processo</span>
                <span className="text-sm font-bold">{processoData.progresso}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${processoData.progresso}%` }}
                  role="progressbar"
                  aria-valuenow={processoData.progresso}
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
                    {/* Linha conectora */}
                    {index < etapas.length - 1 && (
                      <div
                        className={`absolute left-6 top-12 w-0.5 h-16 ${
                          etapa.status === 'concluido' ? 'bg-youvisa-green' : 'bg-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Ícone */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full ${getStatusColor(
                          etapa.status
                        )} flex items-center justify-center text-2xl`}
                        aria-hidden="true"
                      >
                        {etapa.icone}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
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

          {/* Coluna Direita: Informações e Documentos */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Informações */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-youvisa-gray mb-4">
                Informações do Visto
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Tipo de Visto</p>
                  <p className="font-semibold text-youvisa-gray">{processoData.visto.tipo}</p>
                </div>
                <div>
                  <p className="text-gray-500">País de Destino</p>
                  <p className="font-semibold text-youvisa-gray">{processoData.visto.pais}</p>
                </div>
                <div>
                  <p className="text-gray-500">Data da Solicitação</p>
                  <p className="font-semibold text-youvisa-gray">
                    {processoData.visto.dataSolicitacao}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Previsão de Conclusão</p>
                  <p className="font-semibold text-youvisa-green">
                    {processoData.visto.dataPrevisao}
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
