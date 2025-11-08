import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-[#1C1F26] border border-gray-300 dark:border-[#2A2D35] hover:border-[#D4AF37] transition-all duration-300"
      aria-label="Toggle theme"
      type="button"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#D4AF37]" />
      ) : (
        <Moon className="w-5 h-5 text-[#D4AF37]" />
      )}
    </button>
  );
}

export default ThemeToggle;
