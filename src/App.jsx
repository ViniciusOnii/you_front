import Navbar from './components/Navbar';
import Acompanhamento from './components/Acompanhamento';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Acompanhamento />
      </main>
      <Footer />
    </div>
  );
}

export default App;
