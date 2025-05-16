import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavLink = ({ to, children, active, onClick }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      onClick={() => {
        window.scrollTo(0, 0);
        onClick?.();
      }}
      className={`relative block w-full px-4 py-2 text-base font-medium transition-colors duration-300 ${
        active 
          ? "text-france font-semibold bg-blue-50/50" 
          : "text-gray-600 hover:text-france hover:bg-blue-50/30"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isAtTop 
          ? "py-2" 
          : "py-2 bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3" 
            onClick={closeMobileMenu}
          >
            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
              <img 
                src="/images/logo.png" 
                alt="Logo"
                className="w-8 h-8 object-contain" 
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'text-france text-2xl font-bold';
                  fallback.textContent = '♞';
                  img.parentNode?.appendChild(fallback);
                }}
              />
            </div>
            <span className="text-lg font-bold text-france hidden sm:block">
              Club Trebejos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { label: "Inicio", to: "/" },
              { label: "Historia", to: "/historia" },
              { label: "Calendario", to: "/calendario" },
              { label: "Resultados", to: "/resultados" },
              { label: "Escuela", to: "/cursos" }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.to
                    ? "text-france bg-blue-50"
                    : "text-gray-600 hover:text-france hover:bg-blue-50/50"
                }`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white border-t mt-2">
            {[
              { label: "Inicio", to: "/" },
              { label: "Historia", to: "/historia" },
              { label: "Calendario", to: "/calendario" },
              { label: "Resultados", to: "/resultados" },
              { label: "Escuela", to: "/cursos" }
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                active={location.pathname === item.to}
                onClick={closeMobileMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;