function Footer() {
  return (
    <footer
      className="py-3 text-center border-t border-[#1C1F26] text-gray-500 font-[Nunito]"
      style={{ backgroundColor: '#0B0D12' }}
    >
      <p className="text-xs tracking-wide">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#D4AF37] font-semibold">CryptoPilot</span>. Tous droits réservés.
      </p>
    </footer>
  );
}

export default Footer;
