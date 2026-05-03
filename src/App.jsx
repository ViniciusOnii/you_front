import { useState } from 'react';
import Navbar from './components/Navbar';
import Acompanhamento from './components/Acompanhamento';
import Footer from './components/Footer';
import FalcaoChatbot from './components/FalcaoChatbot';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProcessosProvider } from './context/ProcessosContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProcessosScreen from './screens/ProcessosScreen';

const AppInterno = () => {
  const { isAuthenticated, carregando } = useAuth();
  const [tela, setTela] = useState('home');

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-youvisa-green to-youvisa-green-light">
        <div className="text-center text-white">
          <svg className="animate-spin w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-white/90 font-medium">Carregando YOUVISA...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <ProcessosProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar telaAtiva={tela} onNavigate={setTela} />
        <main className="flex-grow">
          {tela === 'home' && <HomeScreen onNavigate={setTela} />}
          {tela === 'processos' && <ProcessosScreen />}
          {tela === 'acompanhamento' && <Acompanhamento />}
        </main>
        <Footer />
        <FalcaoChatbot />
      </div>
    </ProcessosProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppInterno />
  </AuthProvider>
);

export default App;
