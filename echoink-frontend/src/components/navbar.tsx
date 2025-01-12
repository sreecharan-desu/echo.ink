import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; image_link: string | null }>({
    username: "",
    image_link: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Simulate fetching user data (replace with actual API call if needed)
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser({
        username: storedUser.username || "User",
        image_link: storedUser.image_link || null,
      });
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-black font-extrabold">echo.ink</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {user.image_link ? (
                <img
                  src={user.image_link}
                  alt="User"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <X size={20} />
                </div>
              )}
              <span className="text-gray-800 font-semibold">
                {user.username}
              </span>
            </div>
          ) : (
            <button className="hidden md:flex items-center px-4 py-2 bg-black text-white text-sm rounded-md shadow hover:bg-white border-2 hover:border-black hover:text-black transition-all">
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col items-start px-4 py-3 space-y-2">
            {!isAuthenticated && (
              <button className="w-full text-left px-4 py-2 bg-black text-white text-sm rounded-md shadow hover:bg-black transition">
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
