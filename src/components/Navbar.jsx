import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2" aria-label="YOUVISA - Página inicial">
            <div className="w-10 h-10 bg-youvisa-green rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-youvisa-gray">YOUVISA</span>
          </a>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#servicos"
              className="text-youvisa-gray font-medium hover:text-youvisa-green transition-colors duration-200"
              aria-label="Ver serviços"
            >
              Serviços
            </a>
            <a
              href="#teste-perfil"
              className="text-youvisa-gray font-medium hover:text-youvisa-green transition-colors duration-200"
              aria-label="Fazer teste de perfil"
            >
              Teste de Perfil
            </a>
            <a
              href="#destino"
              className="text-youvisa-gray font-medium hover:text-youvisa-green transition-colors duration-200"
              aria-label="Encontrar destino"
            >
              Encontre seu Destino
            </a>
            <a
              href="#blog"
              className="text-youvisa-gray font-medium hover:text-youvisa-green transition-colors duration-200"
              aria-label="Acessar blog"
            >
              Blog
            </a>
            <button
              className="bg-youvisa-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-youvisa-green border-2 border-youvisa-green transition-all duration-300"
              aria-label="Entrar em contato conosco"
            >
              FALE CONOSCO
            </button>
          </div>

          {/* Menu Mobile - Hamburger */}
          <div className="md:hidden">
            <button
              className="text-youvisa-gray p-2"
              aria-label="Abrir menu de navegação"
              aria-expanded="false"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
