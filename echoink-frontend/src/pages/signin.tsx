import { useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "./Home";
import { userAtom } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const navigateTo = useNavigate();

  // Clear error when user starts typing
  const handleInputChange = (setter) => (e) => {
    setError("");
    setter(e.target.value);
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || "Failed to sign in");
      }

      if (result.success && result.token) {
        // Store user data and token
        localStorage.setItem("token", result.token);
        setUser(result.user);
        
        // Show success message and redirect
        toast.success("Welcome back to echo.ink!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        
        navigateTo('/');
      } else {
        throw new Error(result.msg || "Invalid credentials");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during sign in", {
        position: "top-right",
        autoClose: 4000,
      });
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignin = () => {
    setUsername("demo_user");
    setPassword("demo123");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/vite.svg" 
            alt="echo.ink logo" 
            className="h-12 w-12 mb-4"
            onClick={() => navigateTo('/')}
            role="button"
            tabIndex={0}
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleInputChange(setUsername)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              placeholder="Enter your username"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm py-2 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleDemoSignin}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Use demo account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            onClick={() => navigateTo('/signup')}
            className="text-sm text-black hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}