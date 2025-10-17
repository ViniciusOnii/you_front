const Servicos = () => {
  // Array de serviços - obrigatório para usar .map()
  const servicos = [
    {
      id: 1,
      titulo: "Solicitação de Visto",
      descricao: "Preenchimento guiado e envio de formulários com toda segurança e praticidade.",
      icone: "📝",
    },
    {
      id: 2,
      titulo: "Acompanhamento de Documentos",
      descricao: "Checklist completo e conferência de pendências para garantir aprovação.",
      icone: "📋",
    },
    {
      id: 3,
      titulo: "Agendamento de Entrevista",
      descricao: "Busca automática por datas disponíveis no consulado mais próximo.",
      icone: "📅",
    },
    {
      id: 4,
      titulo: "Suporte Especializado",
      descricao: "Equipe dedicada para tirar todas as suas dúvidas durante o processo.",
      icone: "💬",
    },
    {
      id: 5,
      titulo: "Tradução Juramentada",
      descricao: "Tradução oficial de documentos por profissionais certificados.",
      icone: "🌐",
    },
    {
      id: 6,
      titulo: "Rastreamento em Tempo Real",
      descricao: "Acompanhe cada etapa do seu processo de visto online, 24/7.",
      icone: "📍",
    },
  ];

  // Estilo inline para o container de serviços (OBRIGATÓRIO)
  const containerStyle = {
    background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
    padding: '80px 0',
  };

  // Estilo inline para os cards (OBRIGATÓRIO)
  const cardStyle = {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  };

  return (
    <section id="servicos" style={containerStyle}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-youvisa-gray mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos soluções completas para simplificar seu processo de visto,
            do início ao fim.
          </p>
        </div>

        {/* Grid de Serviços usando .map() - OBRIGATÓRIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicos.map((servico) => (
            <div
              key={servico.id}
              style={cardStyle}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 border-2 border-gray-100 hover:border-youvisa-green"
              role="article"
              aria-labelledby={`servico-titulo-${servico.id}`}
            >
              {/* Ícone */}
              <div
                className="w-16 h-16 bg-youvisa-green/10 rounded-full flex items-center justify-center mb-6"
                aria-hidden="true"
              >
                <span className="text-4xl" role="img" aria-label={servico.titulo}>
                  {servico.icone}
                </span>
              </div>

              {/* Título */}
              <h3
                id={`servico-titulo-${servico.id}`}
                className="text-xl font-bold text-youvisa-gray mb-3"
              >
                {servico.titulo}
              </h3>

              {/* Descrição */}
              <p className="text-gray-600 leading-relaxed">
                {servico.descricao}
              </p>

              {/* Link "Saiba mais" */}
              <a
                href={`#servico-${servico.id}`}
                className="inline-flex items-center mt-4 text-youvisa-green font-semibold hover:text-youvisa-green-light transition-colors duration-200"
                aria-label={`Saiba mais sobre ${servico.titulo}`}
              >
                Saiba mais
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Não encontrou o que procura?
          </p>
          <button
            className="bg-youvisa-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-youvisa-green border-2 border-youvisa-green transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-youvisa-green focus:ring-offset-2"
            aria-label="Falar com especialista"
          >
            Fale com um Especialista
          </button>
        </div>
      </div>
    </section>
  );
};

export default Servicos;
