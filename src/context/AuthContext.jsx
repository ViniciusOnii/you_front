import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'youvisa:currentUser';

// Usuários mockados (base local de autenticação)
const MOCK_USERS = [
  {
    id: 'u-001',
    nome: 'João Silva',
    email: 'joao@youvisa.com',
    senha: '123456',
  },
  {
    id: 'u-002',
    nome: 'Maria Souza',
    email: 'maria@youvisa.com',
    senha: 'senha123',
  },
  {
    id: 'u-003',
    nome: 'Pedro Costa',
    email: 'pedro@youvisa.com',
    senha: 'pedro2025',
  },
];

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Restauração automática da sessão
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        setUser(JSON.parse(salvo));
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setCarregando(false);
    }
  }, []);

  const login = ({ email, senha }) => {
    if (!email || !senha) {
      return { ok: false, erro: 'Preencha email e senha.' };
    }
    if (!validarEmail(email)) {
      return { ok: false, erro: 'Email inválido.' };
    }
    if (senha.length < 6) {
      return { ok: false, erro: 'A senha deve ter pelo menos 6 caracteres.' };
    }

    const encontrado = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );

    if (!encontrado) {
      return { ok: false, erro: 'Email ou senha incorretos.' };
    }

    const { senha: _senha, ...userSemSenha } = encontrado;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userSemSenha));
    setUser(userSemSenha);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        carregando,
        login,
        logout,
        usuariosMock: MOCK_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
};
