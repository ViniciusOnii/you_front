import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { login, usuariosMock } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    // Pequeno delay simulando requisição (melhora feedback visual)
    setTimeout(() => {
      const resultado = login({ email: email.trim(), senha });
      if (!resultado.ok) {
        setErro(resultado.erro);
        setEnviando(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-youvisa-green via-youvisa-green-light to-emerald-400 px-4 py-12 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
            <svg
              className="w-8 h-8 text-youvisa-green"
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
          <span className="text-3xl font-bold text-white drop-shadow-sm">YOUVISA</span>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-youvisa-gray mb-1">Bem-vindo de volta</h1>
          <p className="text-gray-500 mb-6">Faça login para acessar sua conta</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-youvisa-gray mb-2"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-youvisa-green focus:border-transparent transition"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-youvisa-gray mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-youvisa-green focus:border-transparent transition"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-youvisa-green transition-colors"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <div
                className="mt-3 mb-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-2 animate-fade-in"
                role="alert"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{erro}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full mt-4 bg-youvisa-green text-white py-3 rounded-lg font-semibold hover:bg-youvisa-green-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {enviando ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Dica de usuários de teste (colapsável) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setMostrarAjuda((v) => !v)}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-youvisa-green transition-colors"
            >
              <span>🔑 Usuários de teste</span>
              <svg
                className={`w-4 h-4 transition-transform ${mostrarAjuda ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mostrarAjuda && (
              <ul className="mt-3 text-xs text-gray-600 space-y-2 animate-fade-in">
                {usuariosMock.map((u) => (
                  <li key={u.id} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                    <div>
                      <p className="font-mono text-youvisa-gray">{u.email}</p>
                      <p className="font-mono text-gray-500">senha: {u.senha}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(u.email);
                        setSenha(u.senha);
                        setErro('');
                      }}
                      className="text-youvisa-green font-semibold hover:underline text-xs"
                    >
                      Usar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="text-center text-white/80 text-xs mt-6">
          © 2025 YOUVISA. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
