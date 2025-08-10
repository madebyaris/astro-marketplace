import React, { useState } from 'react';

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const validImages = images.filter(Boolean);
  const [current, setCurrent] = useState<number>(0);

  if (!validImages.length) return null;

  const currentSrc = validImages[Math.min(current, validImages.length - 1)];

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <img src={currentSrc} alt={alt} className="h-full w-full object-cover" />
      </div>

      {validImages.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {validImages.slice(0, 5).map((src, idx) => (
            <button
              key={src + idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Show image ${idx + 1}`}
              aria-current={idx === current}
              className={`h-16 overflow-hidden rounded border object-cover ${
                idx === current ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-gray-200'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


