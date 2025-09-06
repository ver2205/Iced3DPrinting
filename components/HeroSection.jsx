'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const HeroSection = ({
  locale = 'en',
  tagline = '',
  tagline2 = '',
  intro = '',
  viewCatalogueLabel = '',
  requestQuoteLabel = ''
}) => {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[75vh] flex items-center relative overflow-hidden">
      
      {/* Faded Logo Background */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-10 z-0">
        <img 
          src="/logo_bq.png" 
          alt="Logo Background" 
          className="w-96 h-96 object-contain"
        />
      </div>

      {/* Animated Yacht */}
      <div className="absolute top-1/2 left-[45%] transform -translate-y-1/2 hidden sm:block">
        <div className="yacht-container">
          <img
            src="yacht1.png"
            alt="Luxury Yacht"
            className="yacht-animation h-50 w-auto"
          />
          {/* Reflection if you want it */}
          {/* <img
            src="/lovable-uploads/9bd99b02-cba9-47ae-8788-d7d13ca6f87e.png"
            alt="Yacht Reflection"
            className="yacht-reflection h-40 w-auto transform scale-y-[-1]"
          /> */}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="whitespace-nowrap text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
             {tagline}
              <span className="block text-slate-700">{tagline2}</span>
            </h1>
            <p className="text-base md:text-xl text-gray-300 mt-6 leading-relaxed">
              {intro}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => router.push(`/${locale}/catalogue`)} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                {viewCatalogueLabel}
              </button>
              <button onClick={() => router.push('/quote')} className="border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:bg-white/5">
              {requestQuoteLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .yacht-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .yacht-animation {
          animation: glideYacht 10s ease-out forwards;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4));
        }

        @keyframes glideYacht {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(7vw));
          }
        }

        /* Optional: reflection styling if enabled */
        .yacht-reflection {
          position: absolute;
          top: 100%;
          margin-top: 4px;
          animation: glideYacht 20s linear infinite;
          filter: blur(1px);
          opacity: 0.1;
        }

        @media (max-width: 768px) {
          .yacht-animation {
            height: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
