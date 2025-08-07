'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ShipImageCarousel from './ShipImageCarousel';
import PartMediaCarousel from './MediaCarousel'; // ← You can reuse ShipImageCarousel if no video support
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ItemDetail = ({ item }) => {
  const router = useRouter();
  const isShip = item.type === 'ship';
  const currentLang = 'en';

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
        href="/catalogue"
        className="inline-flex items-center text-white hover:text-blue-300 transition-colors duration-200 mb-10"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Catalogue
      </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Media Section */}
          <div>
            {isShip ? (
              <ShipImageCarousel images={item.images} />
            ) : (
              <PartMediaCarousel media={item.media} />
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {item.slug || item.name}
              </h1>
              {item.description?.[currentLang] && (
                <p className="text-xl text-gray-300 leading-relaxed">
                  {item.description[currentLang]}
                </p>
              )}
              {item.description && typeof item.description === 'string' && (
                <p className="text-xl text-gray-300 leading-relaxed">{item.description}</p>
              )}
            </div>

            {/* Dimensions or Specs */}
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Specifications
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(isShip ? item.dimensions : item.specs).map(([label, value]) => (
                  <div key={label}>
                    <span className="text-gray-400 text-sm">{label}</span>
                    <p className="text-white font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features – Ships only */}
            {isShip && item.features?.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Features</h3>
                <ul className="space-y-3">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mr-4 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price and CTA */}
            <div className="border-t border-gray-700 pt-8">

              <div className="flex flex-col sm:flex-row gap-4">
    {isShip ? (
      <button
        onClick={() => router.push('/quote')}
        className="flex-1 border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:bg-white/5"
      >
        Request Quote
      </button>
    ) : (
      <div className="flex-1 flex flex-col items-center">
      <p className="text-gray-400 text-sm mb-2">
        You’ll be redirected to our partner store
      </p>
      <a
        href={item.purchase_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:bg-blue-500/10"
      >
        Buy Now
      </a>
    </div>
    )}
  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
