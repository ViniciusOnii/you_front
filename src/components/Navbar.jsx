import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ telaAtiva, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItem = (chave, label) => (
    <button
      onClick={() => {
        onNavigate?.(chave);
        setMenuAberto(false);
      }}
      className={`font-medium transition-colors duration-200 ${
        telaAtiva === chave
          ? 'text-youvisa-green'
          : 'text-youvisa-gray hover:text-youvisa-green'
      }`}
    >
      {label}
    </button>
  );

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
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center space-x-2"
            aria-label="YOUVISA - Página inicial"
          >
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
          </button>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItem('home', 'Início')}
            {navItem('processos', 'Processos')}
            {navItem('acompanhamento', 'Acompanhamento')}

            {user && (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-youvisa-green rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-youvisa-gray leading-tight">
                      {user.nome}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-youvisa-gray font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  Sair
                </button>
              </div>
            )}
          </div>

          {/* Menu Mobile - Hamburger */}
          <div className="md:hidden">
            <button
              className="text-youvisa-gray p-2"
              aria-label="Abrir menu de navegação"
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((v) => !v)}
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

        {/* Menu Mobile - Aberto */}
        {menuAberto && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <div className="flex flex-col space-y-3">
              {navItem('home', 'Início')}
              {navItem('processos', 'Processos')}
              {navItem('acompanhamento', 'Acompanhamento')}
            </div>
            {user && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-youvisa-gray">{user.nome}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-youvisa-gray font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
