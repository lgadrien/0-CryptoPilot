function Header() {
  return (
    <header className="w-full py-5 bg-[#0B0D12] border-b border-[#1C1F26]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 font-[Nunito]">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/LogonoBG.png"
            alt="CryptoPilot Logo"
            className="w-9 h-9"
          />
          <h1 className="text-2xl font-bold text-[#D4AF37] tracking-wide">
            CryptoPilot
          </h1>
        </div>

        <nav className="space-x-6 text-gray-300 text-sm font-medium">
          <a
            href="#"
            className="relative transition-all duration-300 hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37]"
          >
            Accueil
          </a>
          <a
            href="#"
            className="relative transition-all duration-300 hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37]"
          >
            Fonctionnalités
          </a>
          <a
            href="#"
            className="relative transition-all duration-300 hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37]"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
