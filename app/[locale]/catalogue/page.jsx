'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Ship, Wrench } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getDictionaryClient } from '@/lib/getDictionaryClient';

const ALL = '__ALL__'; 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PAGE_SIZE = 9;

export default function CataloguePage() {
  const router = useRouter();
  const pathname = usePathname() || '/en';
  const locale = (pathname.split('/')[1] || 'en');

  const [t, setT] = useState(null);

  const [ships, setShips] = useState([]);
  const [shipParts, setShipParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL);

  const [pageShips, setPageShips] = useState(1);
  const [pageParts, setPageParts] = useState(1);

  useEffect(() => {
    // load dictionary client-side (this page is a client component)
    (async () => {
      const dict = await getDictionaryClient(locale);
      setT(dict?.catalogue || {});
    })();
    setSelectedCategory(ALL);
  }, [locale]);

  useEffect(() => {
    async function fetchData() {
      let catList = [];
    
      const { data: catRaw } = await supabase
        .from('category')
        .select('id, name, name_en, name_nl');
    
      if (catRaw) {
        catList = catRaw.map((c) => ({
          id: c.id,
          code: c.name, // stable key for filtering
          name: locale === 'nl' ? c.name_nl : c.name_en, // translated
        }));
        setCategories(catList);
      }
    
      const { data: shipData } = await supabase
        .from('ship')
        .select(`id, slug, scale, category_id, ship_images(image_url), ship_translations(language, title, description)`);
    
      if (shipData) {
        setShips(
          shipData.map((ship) => {
            const cat = catList.find((c) => c.id === ship.category_id);
            return {
              id: ship.id,
              name:
                ship.ship_translations?.find((tr) => tr.language === locale)?.title ||
                ship.ship_translations?.find((tr) => tr.language === 'en')?.title ||
                ship.slug,
              description:
                ship.ship_translations?.find((tr) => tr.language === locale)?.description || '',
              image: ship.ship_images?.[0]?.image_url || '/placeholder.jpg',
              scale: ship.scale || '',
              category: cat?.name || (locale === 'nl' ? 'Ongecategoriseerd' : 'Uncategorized'),
              categoryCode: cat?.code,
            };
          })
        );
      }
    
      const { data: partData } = await supabase
        .from('ship_part')
        .select(`
          id, slug, height, width, length, article_number, name_en, name_nl, scale, category_id,
          ship_part_media(media_url, media_type, sort_order)
        `);
    
      if (partData) {
        setShipParts(
          partData.map((part) => {
            const imageMedia = part.ship_part_media?.find((m) => m.media_type === 'picture');
            const cat = catList.find((c) => c.id === part.category_id);
            return {
              id: part.id,
              name: locale === 'nl' ? part.name_nl : part.name_en,
              description: part.article_number || '',
              image: imageMedia?.media_url || '/placeholder.jpg',
              scale: part.scale || '1:50',
              category: cat?.name || (locale === 'nl' ? 'Ongecategoriseerd' : 'Uncategorized'),
              categoryCode: cat?.code,
            };
          })
        );
      }
    }
    
      fetchData();
    }, [locale]);

const filterItems = (items, categoryCode) =>
  categoryCode === ALL ? items : items.filter((i) => i.categoryCode === categoryCode);

const onCategoryClick = (code) => {
  setSelectedCategory(code);
  setPageShips(1);
  setPageParts(1);
};

  // const onCategoryClick = (cat) => {
  //   setSelectedCategory(cat);
  //   setPageShips(1);
  //   setPageParts(1);
  // };

  const Paginator = ({ page, setPage, total }) => {
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const prevLabel = t?.paginator?.prev || 'Prev';
    const nextLabel = t?.paginator?.next || 'Next';
    const pageLabel = (t?.paginator?.page || 'Page {current} / {total}')
      .replace('{current}', String(page))
      .replace('{total}', String(maxPage));
  
    // hide if only 1 page and you prefer no controls
    if (maxPage <= 1) {
      return (
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="text-gray-300 px-2">{pageLabel}</span>
        </div>
      );
    }
  
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          className="px-3 py-2 rounded-md bg-gray-800 text-gray-200 disabled:opacity-40"
          disabled={page <= 1}
          aria-label={prevLabel}
        >
          {prevLabel}
        </button>
  
        <span className="text-gray-300 px-2">{pageLabel}</span>
  
        <button
          onClick={() => setPage(Math.min(maxPage, page + 1))}
          className="px-3 py-2 rounded-md bg-gray-800 text-gray-200 disabled:opacity-40"
          disabled={page >= maxPage}
          aria-label={nextLabel}
        >
          {nextLabel}
        </button>
      </div>
    );
  };
  


  const ItemGrid = ({ items, type, page }) => {
    const filtered = filterItems(items, selectedCategory);
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);
  


    return (
      <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageItems.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/${locale}/item/${item.id}?type=${type}`)}
              className="bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {type === 'ship' ? <Ship className="h-4 w-4 text-white" /> : <Wrench className="h-4 w-4 text-white" />}
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">{item.category}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-full font-medium transition-colors">
                  {t?.buttons?.view_details || 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <Paginator page={page} setPage={type === 'ship' ? setPageShips : setPageParts} total={filtered.length} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t?.title || 'Our Collection'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t?.subtitle || 'Discover our meticulously crafted naval replicas — precision 3D printed and rich in detail.'}
          </p>
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="ships" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="ships" className="flex items-center gap-2 text-base">
              <Ship className="h-4 w-4" />
              {t?.tabs?.ships || 'Ships'}
            </TabsTrigger>
            <TabsTrigger value="parts" className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4" />
              {t?.tabs?.parts || 'Ship Parts'}
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap gap-4 justify-center">
    {[{ code: ALL, name: t?.filters?.all || 'All' }, ...categories].map((c) => (
      <button
        key={c.code}
        onClick={() => onCategoryClick(c.code)}
        className={`px-6 py-2 rounded-full border-2 font-medium transition-colors ${
          selectedCategory === (c.code)
            ? 'bg-slate-700 text-white border-gray-900'
            : 'border-slate-700 text-slate-300 hover:bg-grey-700 hover:text-white'
        }`}
      >
        {c.name}
      </button>
    ))}
  </div>

          <TabsContent value="ships" className="space-y-8">
            <ItemGrid items={ships} type="ship" page={pageShips} />
          </TabsContent>

          <TabsContent value="parts" className="space-y-8">
            <ItemGrid items={shipParts} type="ship_part" page={pageParts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
