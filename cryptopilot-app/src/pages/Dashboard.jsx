import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">Tableau de bord</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Bienvenue sur votre espace CryptoPilot</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Portfolio Total</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">$12,450.00</p>
            <p className="text-green-400 text-xs sm:text-sm mt-2">+5.2% cette semaine</p>
          </div>

          <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Nombre d'actifs</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">8</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-2">Cryptomonnaies</p>
          </div>

          <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300 sm:col-span-2 lg:col-span-1">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Gain/Perte 24h</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">+$248.50</p>
            <p className="text-green-400 text-xs sm:text-sm mt-2">+2.1%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
          <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">Mes Cryptomonnaies</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 dark:bg-[#0B0D12] rounded-lg transition-colors duration-300 gap-2 sm:gap-0">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">Bitcoin (BTC)</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">0.25 BTC</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">$8,450.00</p>
                <p className="text-xs sm:text-sm text-green-400">+3.2%</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 dark:bg-[#0B0D12] rounded-lg transition-colors duration-300 gap-2 sm:gap-0">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">Ethereum (ETH)</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">2.5 ETH</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">$4,000.00</p>
                <p className="text-xs sm:text-sm text-red-400">-1.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
