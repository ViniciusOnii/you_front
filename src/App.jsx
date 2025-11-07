import Navbar from './components/Navbar';
import Acompanhamento from './components/Acompanhamento';
import Footer from './components/Footer';
import FalcaoChatbot from './components/FalcaoChatbot';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Acompanhamento />
      </main>
      <Footer />
      <FalcaoChatbot />
    </div>
  );
}

export default App;
