'use client';
import React from 'react';
import { FileText, File, Check, Compass, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProcessSteps = () => {
  const router = useRouter();

  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Ship Selection",
      description: "Choose your vessel from our catalog or request a custom design"
    },
    {
      icon: <File className="w-8 h-8" />,
      title: "Receive Quote & Details",
      description: "Get pricing, timeline and technical specifications"
    },
    {
      icon: <Check className="w-8 h-8" />,
      title: "Approve First Sample",
      description: "Review and approve the initial 3D model design"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Precision Crafting",
      description: "Expert 3D printing and hand-finishing process"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Ready for Display!",
      description: "Receive your museum-quality ship model"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
  CREATE YOUR CUSTOM
  <span className="block text-slate-700">SHIP IN 5 STEPS</span>
</h2>

          <p className="text-xl md:text-2xl text-gray-300 mt-6 leading-relaxed">
            We focus on a clear and simple process. Once you submit a request, we ensure all 
            information is clearly documented. After you're satisfied with the digital design, 
            we can begin the production process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-gray-400 text-xs">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => router.push('/process')}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            More Information
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
