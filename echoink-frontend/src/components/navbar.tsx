import { useState, useEffect } from "react";
import { Menu, Pen, User, X, Home, BookOpen, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/store";
import { BASE_URL } from "../pages/Home";

const SearchBar = React.lazy(() => import('../components/SearchBar'));

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const [scrolled, setScrolled] = useState(false);
  const navigateTo = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    navigateTo(path);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    handleNavigation("/");
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!checkAuth()) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/getprofile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Profile fetch failed');
        }

        const data = await response.json();

        if (data?.success && data?.user) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      }
    };

    if (checkAuth()) {
      fetchUserProfile();
    }
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest('.mobile-menu')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => handleNavigation("/")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigation("/")}
            >
              <img 
                src="/vite.svg" 
                alt="Logo" 
                className="h-8 w-8 transition-transform group-hover:rotate-12" 
              />
              <span className="text-xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                echo.ink
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-1 justify-center px-8">
            <div className="w-full max-w-2xl">
              <React.Suspense fallback={
                <div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg" />
              }>
                <SearchBar />
              </React.Suspense>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavigation('/write')}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105 active:scale-95"
                >
                  <Pen size={16} />
                  <span>Write</span>
                </button>

                <div className="relative group">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    {user?.image_link ? (
                      <img
                        src={user.image_link}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-black transition-all duration-200 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all duration-200">
                        <User size={20} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      </div>
                      
                      <button
                        onClick={() => handleNavigation("/")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Home size={16} />
                        <span>Home</span>
                      </button>
                      
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <BookOpen size={16} />
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/signin')}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105 active:scale-95"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3">
          <React.Suspense fallback={
            <div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg" />
          }>
            <SearchBar />
          </React.Suspense>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-3 px-2 py-3">
                  {user?.image_link ? (
                    <img
                      src={user.image_link}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigation('/write')}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Pen size={16} />
                  <span>Write</span>
                </button>

                <button
                  onClick={() => handleNavigation('/profile')}
                  className="w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <BookOpen size={16} />
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation('/signin')}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}