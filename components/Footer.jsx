import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
    
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
      <div className="flex justify-center ml-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center text-center md:text-left">

          {/* Brand Section */}
          <div className="space-y-4 mx-auto md:mx-0">
            <div className="flex items-center space-x-3">
            <Image src="/logo_bq.png" alt="Iced3DPrinting Logo" width={40} height={40} />
              <div className="text-xl font-bold text-white">
                Iced3D<span className="text-slate-600">Printing</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Preserving maritime history through exceptional craftsmanship and precision 3D printing technology.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="mx-auto md:mx-0">  

            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/catalogue" className="hover:text-white transition-colors duration-200">Catalogue</a></li>
            <li><a href="/process" className="hover:text-white transition-colors duration-200">Our Process</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact</a></li>
            <li><a href="/quote" className="hover:text-white transition-colors duration-200">Request Quote</a></li>

            </ul>
          </div>

         

          {/* Contact Info */}
          <div className="mx-auto md:mx-0">
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@iced3dprinting.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>123 Maritime Plaza<br />Boston, MA 02110</span>
              </div>
            </div>
          </div>
        </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Iced3DPrinting. All rights reserved.
          </p>
          
        </div>
        
      </div>
      
    </footer>
  );
};

export default Footer;
