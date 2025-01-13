import { useState, useEffect } from "react";
import { Menu, Pen, User, X } from "lucide-react";
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
  const navigateTo = useNavigate();

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigateTo(path);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    handleNavigation("/");
  };

  // Function to check if token exists
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    // Set initial authentication state
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
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Profile fetch failed');
        }

        const data = await response.json();

        if (data && data.user) {
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
  }, [setUser]); // Add setUser to dependencies

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.mobile-menu')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Check authentication status on user atom changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-black">echo.ink</span>
        </div>

        {/* Search Bar Section */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <React.Suspense fallback={<div className="w-full h-10 bg-gray-100 animate-pulse rounded-md" />}>
            <SearchBar />
          </React.Suspense>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              {/* Write Button for Authenticated Users */}
              <button
                onClick={() => handleNavigation('/write')}
                className="hidden md:flex items-center px-4 py-2 bg-black text-white text-sm rounded-md shadow hover:bg-white border-2 border-black hover:text-black transition-all duration-200"
              >
                <Pen size={12} className="mr-2" />
                <span>Write</span>
              </button>

              {/* User Profile Section */}
              <div className="flex items-center space-x-3 cursor-pointer group relative">
                <div
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation('/profile')}
                >
                  {user?.image_link ? (
                    <img
                      src={user.image_link}
                      alt={user.username}
                      className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                  )}
                  <span className="text-gray-800 font-medium hidden md:inline">
                    {user?.username}
                  </span>
                </div>

                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => handleNavigation('/signin')}
              className="hidden md:flex items-center px-4 py-2 bg-black text-white text-sm rounded-md shadow hover:bg-white border-2 border-black hover:text-black transition-all duration-200"
            >
              <Pen size={12} className="mr-2" />
              <span>Write</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Bar for Mobile */}
      <div className="md:hidden px-4 pb-3">
        <React.Suspense fallback={<div className="w-full h-10 bg-gray-100 animate-pulse rounded-md" />}>
          <SearchBar />
        </React.Suspense>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 mobile-menu">
          <div className="flex flex-col items-start px-4 py-3 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2">
                  {user?.image_link ? (
                    <img
                      src={user.image_link}
                      alt={user.username}
                      className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                  )}
                  <span className="text-gray-800 font-medium">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={() => handleNavigation('/write')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Write
                </button>
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation('/signin')}
                className="w-full text-left px-4 py-2 bg-black text-white text-sm rounded-md shadow hover:bg-gray-800 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}