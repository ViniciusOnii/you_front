import { useAuth } from '../context/AuthContext';
import { useProcessos, getStatusLabel } from '../context/ProcessosContext';

const cardStatusStyle = {
  aguardando_docs: 'bg-yellow-100 text-yellow-800',
  em_analise: 'bg-blue-100 text-blue-800',
  agendado: 'bg-purple-100 text-purple-800',
  aprovado: 'bg-green-100 text-green-800',
  negado: 'bg-red-100 text-red-800',
};

const HomeScreen = ({ onNavigate }) => {
  const { user } = useAuth();
  const { processos } = useProcessos();

  const total = processos.length;
  const emAndamento = processos.filter((p) =>
    ['aguardando_docs', 'em_analise', 'agendado'].includes(p.status)
  ).length;
  const aprovados = processos.filter((p) => p.status === 'aprovado').length;
  const negados = processos.filter((p) => p.status === 'negado').length;

  const taxaAprovacao =
    total > 0 ? Math.round((aprovados / total) * 100) : 0;

  const ultimos = processos.slice(0, 4);

  const primeiroNome = user?.nome?.split(' ')[0] || 'viajante';

  return (
    <div className="pt-20 bg-gray-50 min-h-screen animate-fade-in">
      {/* Hero redesenhado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004d3d] via-youvisa-green to-youvisa-green-light">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-widest bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-semibold">
              Dashboard
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Olá, {primeiroNome} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mb-8">
            Acompanhe o andamento dos seus processos de visto e gerencie tudo em um só lugar.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate?.('processos')}
              className="bg-white text-youvisa-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Solicitação
            </button>
            <button
              onClick={() => onNavigate?.('acompanhamento')}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Acompanhar Processo
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 pb-12 relative">
        {/* Cards de estatísticas redesenhados */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total de Processos"
            valor={total}
            tendencia={total > 0 ? 'Acompanhe abaixo' : 'Nenhum ainda'}
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            gradiente="from-slate-700 to-slate-900"
          />
          <StatCard
            label="Em Andamento"
            valor={emAndamento}
            tendencia="Processos ativos"
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradiente="from-blue-500 to-indigo-600"
          />
          <StatCard
            label="Aprovados"
            valor={aprovados}
            tendencia={total > 0 ? `${taxaAprovacao}% de taxa` : '—'}
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
            gradiente="from-emerald-500 to-green-600"
          />
          <StatCard
            label="Negados"
            valor={negados}
            tendencia={negados > 0 ? 'Revise documentos' : 'Nenhum até agora'}
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            gradiente="from-rose-500 to-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Últimos processos - ocupa 2 colunas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-bold text-youvisa-gray">
                    Últimas solicitações
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Acompanhamento em tempo real
                  </p>
                </div>
                {processos.length > 0 && (
                  <button
                    onClick={() => onNavigate?.('processos')}
                    className="text-youvisa-green font-semibold hover:bg-youvisa-green/10 px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-1"
                  >
                    Ver todos
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {ultimos.length === 0 ? (
                <EmptyState onNavigate={onNavigate} />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {ultimos.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => onNavigate?.('acompanhamento')}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-youvisa-green to-youvisa-green-light rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-youvisa-gray group-hover:text-youvisa-green transition-colors">
                            Visto de {p.tipoVisto}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {p.dataSolicitacao}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                            cardStatusStyle[p.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {getStatusLabel(p.status)}
                        </span>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-youvisa-green group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Coluna lateral com dicas e atalhos */}
          <div className="space-y-6">
            {/* Card de progresso geral */}
            {total > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-youvisa-gray mb-4">
                  Visão Geral
                </h3>
                <div className="space-y-4">
                  <ProgressRow
                    label="Aprovados"
                    valor={aprovados}
                    total={total}
                    cor="bg-emerald-500"
                  />
                  <ProgressRow
                    label="Em andamento"
                    valor={emAndamento}
                    total={total}
                    cor="bg-blue-500"
                  />
                  <ProgressRow
                    label="Negados"
                    valor={negados}
                    total={total}
                    cor="bg-rose-500"
                  />
                </div>
              </div>
            )}

            {/* Card de dica */}
            <div className="relative overflow-hidden bg-gradient-to-br from-youvisa-green to-youvisa-green-light rounded-2xl shadow-sm p-6 text-white">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-4 translate-y-4" />
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-1">Dica do Inho 🦅</h3>
                <p className="text-sm text-white/90 mb-4">
                  Mantenha seus documentos em dia e organize a documentação antes de iniciar a solicitação para agilizar o processo.
                </p>
                <button className="text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors">
                  Conversar com o Inho
                </button>
              </div>
            </div>

            {/* Atalhos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-youvisa-gray mb-4">
                Atalhos
              </h3>
              <div className="space-y-2">
                <AtalhoItem
                  icone="📋"
                  label="Meus Processos"
                  descricao="Gerenciar solicitações"
                  onClick={() => onNavigate?.('processos')}
                />
                <AtalhoItem
                  icone="🔍"
                  label="Acompanhar"
                  descricao="Ver linha do tempo"
                  onClick={() => onNavigate?.('acompanhamento')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, valor, tendencia, icone, gradiente }) => (
  <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group">
    <div
      className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradiente} opacity-[0.08] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}
    />
    <div className="relative">
      <div
        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradiente} text-white flex items-center justify-center mb-3 shadow-sm`}
      >
        {icone}
      </div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-youvisa-gray mt-1">{valor}</p>
      <p className="text-xs text-gray-400 mt-1">{tendencia}</p>
    </div>
  </div>
);

const ProgressRow = ({ label, valor, total, cor }) => {
  const percent = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-youvisa-gray font-medium">{label}</span>
        <span className="text-gray-500">
          {valor} <span className="text-gray-400">({percent}%)</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${cor} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const AtalhoItem = ({ icone, label, descricao, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
  >
    <span className="text-2xl">{icone}</span>
    <div className="flex-1">
      <p className="font-semibold text-youvisa-gray text-sm">{label}</p>
      <p className="text-xs text-gray-500">{descricao}</p>
    </div>
    <svg className="w-4 h-4 text-gray-300 group-hover:text-youvisa-green group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const EmptyState = ({ onNavigate }) => (
  <div className="text-center py-14 px-6">
    <div className="relative inline-block mb-5">
      <div className="w-24 h-24 bg-gradient-to-br from-youvisa-green/20 to-youvisa-green/5 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-12 h-12 text-youvisa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-youvisa-green rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-slow">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
    <h3 className="text-lg font-bold text-youvisa-gray mb-1">
      Nenhuma solicitação ainda
    </h3>
    <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
      Comece criando sua primeira solicitação de visto. Nosso sistema vai te guiar em cada passo.
    </p>
    <button
      onClick={() => onNavigate?.('processos')}
      className="bg-gradient-to-r from-youvisa-green to-youvisa-green-light text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Criar primeira solicitação
    </button>
  </div>
);

export default HomeScreen;
