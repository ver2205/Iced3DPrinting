'use client';
import React from 'react';
import { useRouter,usePathname } from 'next/navigation';
import ShipImageCarousel from './ShipImageCarousel';
import PartMediaCarousel from './MediaCarousel';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDictionaryClient } from '@/lib/getDictionaryClient';

const ItemDetail = ({ item }) => {
  const router = useRouter();
  const isShip = item.type === 'ship';
  const pathname = usePathname() || '/en';
  const locale = pathname.split('/')[1] || 'en';
  const [t, setT] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const dict = await getDictionaryClient(locale);
      setT(dict?.specs || {});
    })();
  }, [locale]);
  if (!t) return null; // wait until translations load


  // Specs mapping with dynamic labels
  const specs = isShip ? item.dimensions : {
    [t.length]: item.specs?.length,
    [t.width]: item.specs?.width,
    [t.height]: item.specs?.height,
    [t.scale]: item.specs?.scale,
    
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/${locale}/catalogue`}
          className="inline-flex items-center text-white hover:text-blue-300 transition-colors duration-200 mb-10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {locale === 'nl' ? 'Terug naar catalogus' : 'Back To Catalogue'} 
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
                {item.name}
              </h1>

              {/* For ships: description comes from translations */}
              {isShip && item.description && (
                <p className="text-xl text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* For parts: show Article Number */}
              {!isShip && item.articleNumber && (
                <div>
                <p className="text-lg text-gray-400">
                  {locale === 'nl' ? 'Artikelnummer ' : 'Article Number'} <span className="text-white font-semibold">{item.articleNumber}</span>
                </p>
                 <div className="bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">
              {locale === 'nl' ? 'Specificaties' : 'Specifications'}

              </h3>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(specs).map(([label, value]) => (
                  <div key={label}>
                    <span className="text-gray-400 text-sm">{label}</span>
                    <p className="text-white font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            </div>
              )}
            </div>

            {/* Specifications */}
           

            {/* Features – only ships
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
            )} */}

            {/* CTA */}
            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {isShip ? (
                  <button
                    onClick={() => router.push('/quote')}
                    className="flex-1 border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:bg-white/5"
                  >
                     {locale === 'nl' ? 'Vraag offerte aan' : 'Request Quote'}
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col items-center">
                    <p className="text-gray-400 text-sm mb-2">
                    {locale === 'nl'
                        ? 'Wilt u een andere schaal? Neem gerust contact met ons op.'
                        : 'If you want a different scale, please contact us.'}
                    </p>
                    {/* <a
                      href={item.purchase_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:bg-blue-500/10"
                    >
                      {locale === 'nl' ? 'Koop nu' : 'Buy Now'}
                    </a> */}
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
