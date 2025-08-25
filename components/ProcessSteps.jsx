'use client';
import React from 'react';
import { FileText, File, Check, Compass, Rocket } from 'lucide-react';
import { useRouter,usePathname } from 'next/navigation';
import { getDictionaryClient } from '@/lib/getDictionaryClient';
import { useEffect, useState } from 'react';


const icons = [FileText, File, Check, Compass, Rocket];

const ProcessSteps = ({ heading, intro, steps, moreInfoLabel }) => {
  const router = useRouter();
  const pathname = usePathname() || '/en';
  const locale = (pathname.split('/')[1] || 'en');
  const [t, setT] = useState(null);

  useEffect(() => {
    // load dictionary client-side (this page is a client component)
    (async () => {
      const dict = await getDictionaryClient(locale);
      setT(dict?.catalogue || {});
    })();
    
  }, [locale]);
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading + Intro */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {heading?.split('\n')[0]}
            <span className="block text-slate-700">
              {heading?.split('\n')[1]}
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mt-6 leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => {
            const Icon = icons[index]; // pick icon by index
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.push(`/${locale}/process`)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
          {moreInfoLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
