'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const CallToAction = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Create Your Masterpiece?
        </h2>
        <p className="text-xl text-slate-200 mb-8 leading-relaxed">
          Transform your vision into reality with our precision 3D printing technology.
          Let's craft something extraordinary together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button  onClick={() => router.push('/quote')} className="bg-white text-slate-800 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
            Start Your Project
          </button>
          <button onClick={() => router.push('/catalogue')} className="border-2 border-white text-white hover:bg-white hover:text-slate-800 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200">
            View Gallery
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;