"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="card aspect-[4/3] flex items-center justify-center bg-gray-100 text-gray-300">
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-8.5-5.5l-2.51 3.01L7 14l-3 4h16l-5.5-7.5z"/>
        </svg>
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative card aspect-[4/3] overflow-hidden bg-gray-100 group cursor-zoom-in" onClick={() => setLightbox(true)}>
          <Image
            src={images[activeIndex]}
            alt={`${title} - foto ${activeIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }} className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4" />
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === activeIndex ? "border-brand-500" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image src={src} alt={`Miniatura ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light">✕</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIndex]}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
