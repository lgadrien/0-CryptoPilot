function Footer() {
  return (
    <footer
      className="py-3 sm:py-4 text-center border-t border-gray-200 dark:border-[#1C1F26] text-gray-600 dark:text-gray-500 bg-white dark:bg-[#0B0D12] font-[Nunito] transition-colors duration-300"
    >
      <p className="text-xs sm:text-sm tracking-wide px-4">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#D4AF37] font-semibold">CryptoPilot</span>. Tous droits réservés.
      </p>
    </footer>
  );
}

export default Footer;
