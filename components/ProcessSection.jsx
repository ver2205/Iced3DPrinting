import React from 'react';

const ProcessSection = ({ step, title, description, image, reverse = false }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-dense' : ''}`}>
      {/* Content */}
      <div className={`space-y-6 ${reverse ? 'lg:col-start-2' : ''}`}>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">{step}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-xl text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Image */}
      <div className={`relative ${reverse ? 'lg:col-start-1' : ''}`}>
      <div className="relative z-10 w-full h-[350px] rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={image}
            alt={title}
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
        </div>
        <div className={`absolute top-8 ${reverse ? '-left-8' : '-right-8'} w-full h-full bg-gradient-to-br from-slate-700/10 to-slate-600/10 rounded-2xl blur-xl`}></div>
      </div>
    </div>
  );
};

export default ProcessSection;