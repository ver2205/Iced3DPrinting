

import React from 'react';
import ProcessSection from '@/components/ProcessSection';
import CallToAction from '@/components/CallToAction';

const ProcessPage = () => {
  const processSteps = [
    {
      step: "01",
      title: "Design & Research",
      description:
        "Our expert team begins with extensive historical research and CAD modeling. Every detail is meticulously planned to ensure historical accuracy and structural integrity. We use advanced 3D modeling software to create precise digital representations of each vessel.",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      step: "02",
      title: "3D Printing",
      description:
        "Using state-of-the-art resin 3D printers, we bring your ship to life layer by layer. Our high-resolution printers capture every intricate detail, from rigging to decorative elements.",
      image:
        "https://images.unsplash.com/photo-1704283860614-803aa8be7993?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      reverse: true,
    },
    {
      step: "03",
      title: "Post-Processing",
      description:
        "Each printed component undergoes cleaning, curing, and support removal. Our skilled craftsmen sand and smooth every surface to achieve the perfect finish.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      step: "04",
      title: "Hand Finishing",
      description:
        "Expert artisans apply painting, weathering effects, and protective coatings. Each ship receives hours of finishing to achieve museum-quality results.",
        image: "https://images.unsplash.com/photo-1608112169461-48616144c894?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

        reverse: true,
    },
    {
      step: "05",
      title: "Quality Control & Delivery",
      description:
        "Each model is inspected and carefully packaged with custom materials. We include documentation about your vessel’s history and specs.",
        image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"

    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      

      {/* Header */}
      {/* <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Process</h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            From digital design to finished masterpiece, discover how we transform 
            historical naval vessels into stunning 3D printed models.
          </p>
        </div>
      </section> */}

      <div className="bg-gradient-to-r from-slate-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Process</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          From digital design to finished masterpiece, discover how we transform 
            historical naval vessels into stunning 3D printed models.          </p>
        </div>
      </div>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {processSteps.map((step, index) => (
            <ProcessSection key={index} {...step} />
          ))}
        </div>
      </section>

      {/* Tech */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Premium Materials & Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-bold text-white">Resin 3D Printing</h3>
              <p className="text-gray-300">High-resolution resin printing for incredibly fine detail and smooth finishes.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-white">Premium Paints</h3>
              <p className="text-gray-300">Museum-quality paints and weathering materials for authentic finishes.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-white">Precision Tools</h3>
              <p className="text-gray-300">Professional modeling tools and equipment for flawless finishing work.</p>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default ProcessPage;
