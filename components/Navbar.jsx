"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-gray-800 backdrop-blur-sm border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div onClick={() => router.push('/')} className="flex-shrink-0 flex items-center space-x-2 cursor-pointer">
            {/* Image Logo */}
            <img 
              src="/logo_bq.png"  // Replace with actual path to your logo image
              alt="Iced3DPrinting Logo"
              className="h-8 w-auto"    // Adjust height as needed (e.g., h-6, h-10)
            />

            {/* Text Logo */}
             <div className="text-1xl font-bold text-white">
              Iced3D<span className="text-slate-600">Printing</span>
            </div> 
          </div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
  <a href="/catalogue" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
    Catalogue
  </a>
  <a href="/process" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
    Our Process
  </a>
  <a href="/contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
    Contact
  </a>
</div>


          {/* Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <button onClick={() => router.push('/quote')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Request a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/50 rounded-lg mt-2">
              <a href="/catalogue" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Catalogue
              </a>
              <a href="/process" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Our Process
              </a>
            
              <a href="/contact" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Contact
              </a>
              <button onClick={() => router.push('/quote')} className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-medium mt-4 transition-colors duration-200">
                Request a Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;