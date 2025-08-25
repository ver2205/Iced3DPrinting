'use client';
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Footer({
  locale = 'en',
  tagline = '',
  links = {},
  contact = {},
}) {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center ml-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center text-center md:text-left">

            {/* Brand */}
            <div className="space-y-4 mx-auto md:mx-0">
              <div className="flex items-center space-x-3">
                <Image src="/logo_bq.png" alt="Iced3DPrinting Logo" width={40} height={40} />
                <div className="text-xl font-bold text-white">
                  Iced3D<span className="text-slate-600">Printing</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {tagline}
              </p>
              <div className="flex space-x-4 justify-center md:justify-start">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="mx-auto md:mx-0">
              <h3 className="text-white font-semibold mb-4"> {locale === 'nl' ? 'Snelle links' : 'Quick Links'}</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href={`/${locale}/catalogue`} className="hover:text-white transition-colors duration-200">
                    {links?.catalogue}
                  </Link>
                </li>
                {/* Če je "Our Process" sekcija na homepage, uporabi anchor; če bo samostojna stran, spremeni v Link na `/${locale}/process` */}
                <li>
                  <a href="#process" className="hover:text-white transition-colors duration-200">
                    {links?.process}
                  </a>
                </li>
                <li>
                  <Link href={`/${locale}/contact`} className="hover:text-white transition-colors duration-200">
                    {links?.contact}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/quote`} className="hover:text-white transition-colors duration-200">
                    {links?.request_quote}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="mx-auto md:mx-0">
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center space-x-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${contact?.email}`} className="hover:text-white">
                    {contact?.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2 justify-center md:justify-start">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${contact?.phone}`} className="hover:text-white">
                    {contact?.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2 justify-center md:justify-start">
                  <MapPin className="w-4 h-4" />
                  <span>{contact?.location}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Iced3DPrinting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
