'use client'
import React from 'react';
import ShipImageCarousel from './ShipImageCarousel';
import { useRouter } from 'next/navigation';

const ShipDetail = ({ ship }) => {
  // Placeholder ship data if none provided
  const router = useRouter();


  const currentShip = ship ;
  const currentLang = 'en'; // This would come from your language context
  
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div>
            <ShipImageCarousel images={currentShip.images} />
          </div>

          {/* Ship Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {currentShip.slug}
              </h1>
              {/* <p className="text-xl text-gray-300 leading-relaxed">
                {currentShip.description[currentLang]}
              </p> */}
            </div>

            {/* Dimensions */}
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Length</span>
                  <p className="text-white font-semibold">{currentShip.dimensions.length}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Width</span>
                  <p className="text-white font-semibold">{currentShip.dimensions.width}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Height</span>
                  <p className="text-white font-semibold">{currentShip.dimensions.height}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Scale</span>
                  <p className="text-white font-semibold">{currentShip.dimensions.scale}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Features</h3>
              <ul className="space-y-3">
                {currentShip.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-4 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and CTA */}
            <div className="border-t border-gray-700 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-white">{currentShip.price}</span>
                  <p className="text-gray-400 text-sm mt-1">{currentShip.availability}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                
                <button  onClick={() => router.push('/quote')} className="flex-1 border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:bg-white/5">
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipDetail;