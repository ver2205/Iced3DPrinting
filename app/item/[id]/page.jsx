'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ItemDetail from '@/components/ItemDetail';
import { ArrowLeft } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ShipPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!id || !type) return;

    async function fetchItem() {
      let data, error;

      if (type === 'ship') {
        const res = await supabase
          .from('ship')
          .select(`
            *,
            ship_images (image_url, alt_text),
            ship_translations (language, description)
          `)
          .eq('id', id)
          .single();

        data = res.data;
        error = res.error;

        if (!error && data) {
          const translations = {};
          data.ship_translations?.forEach((t) => {
            translations[t.language] = t.description;
          });

          setItem({
            ...data,
            type: 'ship',
            description: translations,
            images: data.ship_images?.map((img) => ({
              url: img.image_url,
              alt: img.alt_text
            })) || [],
            dimensions: {
              length: `${data.length} m`,
              width: `${data.width} m`,
              height: `${data.height} m`,
              scale: data.scale || '1:100'
            },
            features: [
              'Hand-finished premium materials',
              'Museum-quality detailing',
              'Historically accurate design',
              'Custom display base included'
            ],
            availability: 'Made to order - send us request quote for price'
          });
        }
      }

      if (type === 'ship_part') {
        const res = await supabase
          .from('ship_part')
          .select(`
            *,
            ship_part_media (media_url, media_type, sort_order)
          `)
          .eq('id', id)
          .single();

        data = res.data;
        error = res.error;

        if (!error && data) {
          const media = data.ship_part_media?.map((m) => ({
            url: m.media_url,
            type: m.media_type
          })) || [];

          setItem({
            ...data,
            type: 'ship_part',
            name: data.slug,
            media,
            specs: {
              length: `${data.length} m`,
              width: `${data.width} m`,
              height: `${data.height} m`
            }
          });
        }
      }

      if (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchItem();
  }, [id, type]);

  if (!item) return <div className="text-white p-10">Loading...</div>;

  return (

    <>
      <ItemDetail item={item} />
    </>
  );
  
}
