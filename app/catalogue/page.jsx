'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Ship, Wrench } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"; 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Catalogue = () => {
  const [ships, setShips] = useState([]);
  const [shipParts, setShipParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
 
      const { data: catData, error: catErr } = await supabase.from('category').select('id, name');
      if (!catErr) setCategories(catData);
    
      const { data: shipData, error: shipErr } = await supabase
      .from('ship')
      .select(`id, slug, scale, category_id, ship_images(image_url), ship_translations(language, title, description)`);
    if (!shipErr) setShips(
      shipData.map(ship => ({
        id: ship.id,
        name: ship.ship_translations?.find(t => t.language === 'en')?.title || ship.slug,
        description: ship.ship_translations?.find(t => t.language === 'en')?.description || '',
        image: ship.ship_images?.[0]?.image_url || '/placeholder.jpg',
        scale: ship.scale || '',
        category: catData.find(c => c.id === ship.category_id)?.name || 'Uncategorized'
      }))
    );

    const { data: partData, error: partErr } = await supabase
    .from('ship_part')
    .select(`
      id,
      slug,
      height,
      width,
      length,
      description,
      category_id,
      ship_part_media(
        media_url,
        media_type,
        sort_order
      )
    `);
  
  
    if (!partErr) setShipParts(
      partData.map(part => {
        const imageMedia = part.ship_part_media?.find(
          media => media.media_type === 'picture'
        );
  
        return {
          id: part.id,
          name: part.slug,
          description: part.description || '',
          image: imageMedia?.media_url || '/placeholder.jpg',
          scale: '', // optional: adjust if you add scale for parts
          category: catData.find(c => c.id === part.category_id)?.name || 'Uncategorized'
        };
      })
    );
    
    }

    fetchData();
  }, []);


  const filterItems = (items, category) => {
    if (category === 'All') return items;
    return items.filter(item => item.category === category);
  };
  
  
  const ItemGrid = ({ items, type }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filterItems(items, selectedCategory).map(item => (
        <div
          key={item.id}
          onClick={() => router.push(`/item/${item.id}?type=${type}`)}

          className="bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
        >
          <div className="relative overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
                        {type === 'ship' ? (
              <Ship className="h-4 w-4 text-black" />
            ) : (
              <Wrench className="h-4 w-4 text-black" />
            )}

              <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                {item.category}
              </span>
            </div>
          </div>
  
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
            
  
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-full font-medium transition-colors">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Collection</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our meticulously crafted naval replicas — precision 3D printed and rich in detail.
          </p>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="ships" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="ships" className="flex items-center gap-2 text-base">
               <Ship className="h-4 w-4" />
                Ships</TabsTrigger>
            <TabsTrigger value="parts" className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4" />
              Ship Parts</TabsTrigger>
          </TabsList>
  
          {/* Category Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {["All", ...categories.map(c => c.name)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full border-2 font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-700 text-white border-gray-900'
                    : 'border-slate-700 text-slate-300 hover:bg-grey-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
  
          {/* Ships */}
          <TabsContent value="ships" className="space-y-8">
            <ItemGrid items={ships} type="ship" />
          </TabsContent>
  
          {/* Ship Parts */}
          <TabsContent value="parts" className="space-y-8">
            <ItemGrid items={shipParts} type="ship_part" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
  
};

export default Catalogue;
