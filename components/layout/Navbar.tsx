import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'nav-blur border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 neon-border-blue flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="font-orbitron font-bold text-primary text-sm">NX</span>
            </div>
            <span className="font-orbitron font-bold text-lg text-foreground hidden sm:block">
              NEXUS<span className="text-primary">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/connect-wallet">
                  <Button variant="outline" className="neon-border-blue hover:bg-primary/10 gap-2">
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </Button>
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card hover:bg-muted/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-secondary">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-2 animate-slide-down">
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost" className="hover:text-primary hover:bg-primary/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary-glow">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-border/50 animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
                    <span className="font-medium text-secondary">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link to="/connect-wallet" className="w-full">
                  <Button variant="outline" className="w-full neon-border-blue gap-2">
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/20"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="w-full">
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button className="w-full btn-primary-glow">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
