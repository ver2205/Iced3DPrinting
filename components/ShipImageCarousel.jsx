
import React, { useState,useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShipImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(true);


  const nextImage = () => {
    updateIndex((currentIndex === images.length - 1 ? 0 : currentIndex + 1));
  };

  const prevImage = () => {
    updateIndex((currentIndex === 0 ? images.length - 1 : currentIndex - 1));
  };

  const goToImage = (index) => {
    updateIndex(index);
  };
  const updateIndex = (newIndex) => {
    setShowCaption(false);
    setCurrentIndex(newIndex);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCaption(true);
    }, 200); // short delay before fading in

    return () => clearTimeout(timeout);
  }, [currentIndex]);


  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-800 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">

      <img
  src={images[currentIndex].url}
  alt={images[currentIndex].alt || `Ship image ${currentIndex + 1}`}
  className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
/>

<div
          className={`absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-4 text-sm rounded-b-2xl transition-opacity duration-500 ${
            showCaption ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {images[currentIndex].alt || `Ship image ${currentIndex + 1}`}
        </div>

        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-slate-600 opacity-100'
                  : 'border-gray-600 opacity-60 hover:opacity-80'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipImageCarousel;