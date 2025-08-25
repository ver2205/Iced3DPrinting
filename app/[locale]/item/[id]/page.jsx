'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ItemDetail from '@/components/ItemDetail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ShipPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const pathname = usePathname() || '/en';
  const locale = (pathname.split('/')[1] || 'en');

  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!id || !type) return;

    async function fetchItem() {
      let data, error;

      // 🚢 Ships (unchanged)
      if (type === 'ship') {
        const res = await supabase
          .from('ship')
          .select(`
            *,
            ship_images (image_url, alt_text),
            ship_translations (language, description, title)
          `)
          .eq('id', id)
          .single();

        data = res.data;
        error = res.error;

        if (!error && data) {
          const translations = {};
          data.ship_translations?.forEach((t) => {
            translations[t.language] = {
              title: t.title,
              description: t.description,
            };
          });

          setItem({
            ...data,
            type: 'ship',
            name:
              translations[locale]?.title ||
              translations['en']?.title ||
              data.slug,
            description:
              translations[locale]?.description || translations['en']?.description || '',
            images:
              data.ship_images?.map((img) => ({
                url: img.image_url,
                alt: img.alt_text,
              })) || [],
            dimensions: {
              length: `${data.length} m`,
              width: `${data.width} m`,
              height: `${data.height} m`,
              scale: data.scale || '1:100',
            },
            features: [
              'Hand-finished premium materials',
              'Museum-quality detailing',
              'Historically accurate design',
              'Custom display base included',
            ],
            availability: 'Made to order - send us request quote for price',
          });
        }
      }

      // ⚙️ Ship parts (updated with translations + article number)
      if (type === 'ship_part') {
        const res = await supabase
          .from('ship_part')
          .select(`
            id, slug, height, width, length, article_number, name_en, name_nl, scale,
            ship_part_media (media_url, media_type, sort_order)
          `)
          .eq('id', id)
          .single();

        data = res.data;
        error = res.error;

        if (!error && data) {
          const media =
            data.ship_part_media?.map((m) => ({
              url: m.media_url,
              type: m.media_type,
            })) || [];

          setItem({
            ...data,
            type: 'ship_part',
            name: locale === 'nl' ? data.name_nl : data.name_en,
            articleNumber: data.article_number,
            media,
            specs: {
              length: `${data.length} m`,
              width: `${data.width} m`,
              height: `${data.height} m`,
              scale: data.scale || '1:50',
            },
          });
        }
      }

      if (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchItem();
  }, [id, type, locale]);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading details...</p>
      </div>
    );
  }

  return <ItemDetail item={item} />;
}
