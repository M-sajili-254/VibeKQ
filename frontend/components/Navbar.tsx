'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, Plane } from 'lucide-react';
import { authService } from '@/utils/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        setIsAuthenticated(true);
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900">
                Vibe<span className="text-red-600">KQ</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/trip-assistant"
              className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              Trip Assistant
            </Link>
            <Link
              href="/community"
              className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              Community
            </Link>
            <Link
              href="/community/merchandise"
              className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              Merchandise
            </Link>
            <Link
              href="/business"
              className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              Business
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            {loading ? (
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium">{user?.username || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/ticket-login"
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-red-400 transition-all shadow-md shadow-red-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/trip-assistant"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Trip Assistant
            </Link>
            <Link
              href="/community"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/community/merchandise"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Merchandise
            </Link>
            <Link
              href="/business"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Business
            </Link>

            <div className="border-t pt-4 mt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{user?.username || 'Profile'}</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full mt-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-left flex items-center space-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/ticket-login"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-center font-semibold rounded-lg hover:from-red-500 hover:to-red-400 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
