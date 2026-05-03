import { useState } from 'react';

const Hero = () => {
  const [formData, setFormData] = useState({
    destino: '',
    motivo: '',
    data: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    // Aqui você pode adicionar a lógica de envio do formulário
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      className="relative pt-32 pb-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #00A884 0%, #00C299 100%)',
      }}
      id="home"
    >
      {/* Mapa-múndi de fundo (SVG semitransparente) */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 200 Q200 150 300 200 T500 200 T700 200 T900 200 T1100 200 M200 250 L250 280 L280 250 L320 270 L350 240 M400 280 Q450 260 500 280 T600 280 M700 250 L750 280 L800 250 L850 270 M150 350 Q200 320 250 350 T350 350 M450 380 L500 350 L550 380 L600 350 M700 380 Q750 350 800 380 T900 380"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
          <circle cx="250" cy="200" r="4" fill="white" opacity="0.5" />
          <circle cx="500" cy="200" r="4" fill="white" opacity="0.5" />
          <circle cx="750" cy="200" r="4" fill="white" opacity="0.5" />
          <circle cx="300" cy="280" r="3" fill="white" opacity="0.4" />
          <circle cx="550" cy="350" r="3" fill="white" opacity="0.4" />
          <circle cx="800" cy="380" r="3" fill="white" opacity="0.4" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Simplificando seu visto.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            Aplique de forma fácil, online e segura.
          </p>
        </div>

        {/* Formulário Flutuante */}
        <div className="max-w-5xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
            aria-label="Formulário de aplicação de visto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Campo Destino */}
              <div className="md:col-span-1">
                <label htmlFor="destino" className="block text-sm font-medium text-youvisa-gray mb-2">
                  Destino
                </label>
                <select
                  id="destino"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-youvisa-green focus:outline-none focus:ring-2 focus:ring-youvisa-green/20 transition-all duration-200 text-youvisa-gray bg-white"
                  aria-label="Selecione o país de destino"
                >
                  <option value="">Escolha o país</option>
                  <option value="eua">Estados Unidos</option>
                  <option value="canada">Canadá</option>
                  <option value="australia">Austrália</option>
                  <option value="uk">Reino Unido</option>
                  <option value="portugal">Portugal</option>
                  <option value="franca">França</option>
                  <option value="alemanha">Alemanha</option>
                  <option value="espanha">Espanha</option>
                </select>
              </div>

              {/* Campo Motivo */}
              <div className="md:col-span-1">
                <label htmlFor="motivo" className="block text-sm font-medium text-youvisa-gray mb-2">
                  Motivo
                </label>
                <select
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-youvisa-green focus:outline-none focus:ring-2 focus:ring-youvisa-green/20 transition-all duration-200 text-youvisa-gray bg-white"
                  aria-label="Selecione o motivo da viagem"
                >
                  <option value="">Motivo da viagem</option>
                  <option value="turismo">Turismo</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="estudo">Estudo</option>
                  <option value="negocios">Negócios</option>
                  <option value="intercambio">Intercâmbio</option>
                </select>
              </div>

              {/* Campo Data */}
              <div className="md:col-span-1">
                <label htmlFor="data" className="block text-sm font-medium text-youvisa-gray mb-2">
                  Já tem data?
                </label>
                <input
                  type="text"
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  placeholder="Viagem programada para..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-youvisa-green focus:outline-none focus:ring-2 focus:ring-youvisa-green/20 transition-all duration-200 text-youvisa-gray placeholder-gray-400"
                  aria-label="Informe a data da viagem"
                />
              </div>

              {/* Botão Aplicar */}
              <div className="md:col-span-1">
                <button
                  type="submit"
                  className="w-full bg-youvisa-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-youvisa-green-light transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-youvisa-green"
                  aria-label="Aplicar para o visto"
                >
                  APLICAR
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
