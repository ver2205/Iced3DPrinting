
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const FeatureSection = ({
  title,
  description,
  imageUrl,
  imageAlt,
  reverse = false,
  features = [],
  ctaLabel
}) => {
  const router = useRouter();

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-dense' : ''}`}>
          {/* Text Content */}
          <div className={`space-y-6 ${reverse ? 'lg:col-start-2' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              {description}
            </p>
            
            {features.length > 0 && (
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-4 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <button onClick={() => router.push('/process')} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              {ctaLabel}
            </button>
          </div>

          {/* Image */}
          <div className={`relative ${reverse ? 'lg:col-start-1' : ''}`}>
            <div className="relative z-10">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative background */}
            <div className={`absolute top-8 ${reverse ? '-left-8' : '-right-8'} w-full h-full bg-gradient-to-br from-slate-700/10 to-slate-600/10 rounded-2xl blur-xl`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;