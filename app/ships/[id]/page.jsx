'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ShipDetail from '@/components/ShipDetail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ShipPage() {
  const { id } = useParams();
  const [ship, setShip] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchShip() {
      const { data, error } = await supabase
        .from('ship')
        .select(`
          *,
          ship_images (image_url, alt_text),
          ship_translations (language, description)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error:', error);
        return;
      }

      // Reformat translations like { en: "...", de: "...", nl: "..." }
      const translations = {};
      data.ship_translations?.forEach((t) => {
        translations[t.language] = t.description;
      });

      // Reformat dimensions and ship object
      const formattedShip = {
        ...data,
        description: translations,
        images: data.ship_images?.map(img => ({
          url: img.image_url,
          alt: img.alt_text
        })) || [],
        dimensions: {
          length: `${data.length} cm`,
          width: `${data.width} cm`,
          height: `${data.height} cm`,
          scale: data.scale || '1:100'
        },
        features: [
          'Hand-finished premium materials',
          'Museum-quality detailing',
          'Historically accurate design',
          'Custom display base included'
        ],
        
        availability: 'Made to order - send us request quote for price'
      };

      setShip(formattedShip);
    }

    fetchShip();
  }, [id]);

  if (!ship) return <div className="text-white p-10">Loading...</div>;

  return (
    <div>
      
      <ShipDetail ship={ship} />
    </div>
  );
}
