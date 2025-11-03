function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <header className="w-full py-6 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold text-blue-600">MyLanding</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:text-blue-600">Accueil</a>
            <a href="#" className="hover:text-blue-600">Fonctionnalités</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Simplifie ton workflow avec <span className="text-blue-600">MyLanding</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Une solution rapide, moderne et légère pour booster ta productivité.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Commencer
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition">
            En savoir plus
          </button>
        </div>
      </main>

      <footer className="py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} MyLanding. Tous droits réservés.
      </footer>
    </div>
  );
}

export default App;
