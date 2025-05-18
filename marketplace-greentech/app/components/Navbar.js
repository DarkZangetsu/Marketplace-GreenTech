'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Bell, Search, ShoppingBag } from 'lucide-react';
import MessageNotification from './MessageNotification';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Will be replaced with actual auth state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">GreenTech</span>
          </Link>

          {/* Search bar - only on desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Rechercher des matériaux..." 
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/listings" className="text-gray-700 hover:text-green-600 font-medium">
              Annonces
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-green-600 font-medium">
              Catégories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 font-medium">
              Contact
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <MessageNotification />
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-green-700" />
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Tableau de bord
                    </Link>
                    <Link href="/dashboard/listings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mes annonces
                    </Link>
                    <Link href="/dashboard/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Messages
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
                
                <Link href="/listings/create" className="btn btn-primary">
                  Déposer une annonce
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="font-medium text-gray-700 hover:text-green-600">
                  Connexion
                </Link>
                <Link href="/auth/register" className="btn btn-primary">
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-4">
            {isLoggedIn && (
              <MessageNotification />
            )}
            
            <button 
              className="text-gray-700 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fadeIn">
            <div className="relative w-full mb-4">
              <input 
                type="text" 
                placeholder="Rechercher des matériaux..." 
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <Link 
              href="/listings"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Annonces
            </Link>
            <Link 
              href="/categories"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Catégories
            </Link>
            <Link 
              href="/about"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              À propos
            </Link>
            <Link 
              href="/contact"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            
            {isLoggedIn ? (
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 px-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-green-700" />
                  </div>
                  <div className="text-sm font-medium">Votre compte</div>
                </div>
                
                <Link 
                  href="/dashboard"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Tableau de bord
                </Link>
                <Link 
                  href="/dashboard/listings"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Mes annonces
                </Link>
                <Link 
                  href="/dashboard/messages"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                
                <div className="px-4 pt-2">
                  <Link 
                    href="/listings/create"
                    className="btn btn-primary w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Déposer une annonce
                  </Link>
                </div>
                
                <button 
                  className="flex items-center w-full text-left py-2 px-4 text-red-600 hover:bg-gray-50 rounded-md"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsOpen(false);
                  }}
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="flex flex-col space-y-3 px-4">
                  <Link 
                    href="/auth/login"
                    className="btn btn-outline w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/auth/register"
                    className="btn btn-primary w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 