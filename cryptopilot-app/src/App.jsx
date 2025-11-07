import Header from './component/layout/Header';
import CryptoTicker from './component/CryptoTicker';
import Footer from './component/layout/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D12] text-gray-200 font-[Nunito]">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#D4AF37] drop-shadow-lg">
          Navigue les marchés crypto avec{' '}
          <span className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors">
            CryptoPilot
          </span>
        </h2>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          Analyse, stratégie et performance réunies dans une interface élégante et précise.
        </p>

        <div className="space-x-4">
          <button className="bg-[#D4AF37] text-[#0B0D12] px-8 py-3 rounded-2xl font-semibold hover:bg-[#F5D76E] transition-all shadow-lg shadow-yellow-900/30">
            Commencer
          </button>

          <button className="border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-2xl font-semibold hover:bg-[#D4AF37] hover:text-[#0B0D12] transition-all shadow-lg shadow-yellow-900/20">
            Découvrir
          </button>
        </div>
      </main>
      <CryptoTicker />
      <Footer />
    </div>
  );
}

export default App;
