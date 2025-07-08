'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Catalogue = () => {
  const [ships, setShips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('id, name');
      if (categoryError) {
        console.error('Error fetching categories:', categoryError);
      } else {
        setCategories(categoryData);
      }

      const { data: shipData, error: shipError } = await supabase
        .from('ship')
        .select(`
          id,
          slug,
          height,
          width,
          length,
          category_id,
          ship_images(image_url, alt_text),
          ship_translations(language, title, description)
        `);
      if (shipError) {
        console.error('Error fetching ships:', shipError);
      } else {
        setShips(shipData);
      }
    }

    fetchData();
  }, []);

  const filteredShips = selectedCategoryId
    ? ships.filter(ship => ship.category_id === selectedCategoryId)
    : ships;

  return (
    <div className="min-h-screen bg-gray-900">
    
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Ship Collection</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our meticulously crafted naval replicas — precision 3D printed and rich in detail.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-6 py-2 rounded-full border-2 ${
              selectedCategoryId === null 
                ? 'bg-slate-700 text-white border-slate-500'
                : 'border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            } transition-colors`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-6 py-2 rounded-full border-2 ${
                selectedCategoryId === cat.id 
                  ? 'bg-slate-700 text-white border-slate-500'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              } transition-colors`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ships Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShips.map(ship => {
            const translation = ship.ship_translations?.find(t => t.language === 'en');
            const title = translation?.title || ship.slug || 'Untitled Ship';
            const description = translation?.description || 'No description available';
            const dimensions = `${ship.length} × ${ship.width} × ${ship.height} cm`;

            return (
              <div
                key={ship.id}
                onClick={() => router.push(`/ships/${ship.id}`)}
                className="bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={ship.ship_images?.[0]?.image_url || '/placeholder.jpg'}
                    alt={ship.ship_images?.[0]?.alt_text || title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-slate-700/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(cat => cat.id === ship.category_id)?.name || 'Uncategorized'}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-slate-300 mb-4">{description}</p>
                  
                  <button className="w-full bg-slate-700 text-white py-3 rounded-full font-medium hover:bg-slate-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't See What You're Looking For?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              We create custom replicas tailored to your specifications.
            </p>
            <button
              onClick={() => router.push('/quote')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
