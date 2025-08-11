'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const MediaCarousel = ({ media = [] }) => {
  const sortedMedia = [...media].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(true);

  const next = () => updateIndex((currentIndex + 1) % sortedMedia.length);
  const prev = () => updateIndex((currentIndex - 1 + sortedMedia.length) % sortedMedia.length);
  const goTo = (i) => updateIndex(i);

  const updateIndex = (i) => {
    setShowCaption(false);
    setCurrentIndex(i);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setShowCaption(true), 200);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  if (!sortedMedia || sortedMedia.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-800 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No media available</span>
      </div>
    );
  }

  const current = sortedMedia[currentIndex];
  const isVideo = current.type === 'video';

  return (
    <div className="relative">
      {/* Main Media */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {isVideo ? (
          <video
            src={current.url}
            muted
            autoPlay
            loop
            playsInline
            controls={false}
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl bg-black"
          />
        ) : (
          <img
            src={current.url}
            alt={current.alt || `Image ${currentIndex + 1}`}
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
          />
        )}

        {/* Caption */}
        <div
          className={`absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-4 text-sm rounded-b-2xl transition-opacity duration-500 ${
            showCaption ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {current.alt || `Media ${currentIndex + 1}`}
        </div>

        {/* Arrows */}
        {sortedMedia.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Counter */}
        {sortedMedia.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {sortedMedia.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sortedMedia.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {sortedMedia.map((m, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-slate-600 opacity-100'
                  : 'border-gray-600 opacity-60 hover:opacity-80'
              }`}
            >
              {m.type === 'video' ? (
                <>
                  <video
                    src={m.url}
                    muted
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="text-white w-6 h-6" />
                  </div>
                </>
              ) : (
                <img
                  src={m.url}
                  alt={m.alt || `Thumb ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
