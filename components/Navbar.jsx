"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || "/en";
  const router = useRouter();

  // pull current locale from the first path segment
  const locale = pathname.split("/")[1] || "en";

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-gray-800 backdrop-blur-sm border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => router.push(`/${locale}`)}
            className="flex-shrink-0 flex items-center space-x-2 cursor-pointer"
          >
            <img src="/logo_bq.png" alt="Iced3DPrinting Logo" className="h-8 w-auto" />
            <div className="text-1xl font-bold text-white">
              Iced3D<span className="text-slate-600">Printing</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-8">
            <Link href={`/${locale}/catalogue`} className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
              Catalogue
            </Link>
            <Link href={`/${locale}/process`} className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
              Our Process
            </Link>
            <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
              Contact
            </Link>
          </div>

          {/* Language Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher locale={locale} />
            <button
              onClick={() => router.push(`/${locale}/quote`)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Request a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher locale={locale} />
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/50 rounded-lg mt-2">
              <Link href={`/${locale}/catalogue`} className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Catalogue
              </Link>
              <Link href={`/${locale}/process`} className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Our Process
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Contact
              </Link>
              <button
                onClick={() => router.push(`/${locale}/quote`)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-medium mt-4 transition-colors duration-200"
              >
                Request a Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
