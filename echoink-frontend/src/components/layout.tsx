import { ReactNode } from "react";
import * as React from "react";
const Navbar = React.lazy(()=>import("./navbar"))

interface LayoutProps {
  children: ReactNode;
}

export default function Layout ({ children }: LayoutProps){
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header>
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} echo.ink. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
