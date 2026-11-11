'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/utils/api';

export default function PhotoGallery({ images, name, label = 'Merchant photos', className = 'h-56' }: {
  images: string[];
  name: string;
  label?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const usable = images.filter((image) => image && !failed.includes(image));
  const current = usable[index % (usable.length || 1)];

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {current ? (
        <img
          src={getImageUrl(current) || ''}
          alt={`${name} - ${label.toLowerCase()} ${index % usable.length + 1}`}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed((previous) => [...previous, current])}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
          {failed.length ? 'Photo unavailable' : 'Merchant photos pending'}
        </div>
      )}
      {current && <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white">{label}</span>}
      {usable.length > 1 && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-slate-950/80 p-1 text-white">
          <button type="button" aria-label={`Previous photo of ${name}`} onClick={() => setIndex((index + usable.length - 1) % usable.length)} className="rounded-full p-2 hover:bg-white/20">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="text-xs">{index % usable.length + 1}/{usable.length}</span>
          <button type="button" aria-label={`Next photo of ${name}`} onClick={() => setIndex((index + 1) % usable.length)} className="rounded-full p-2 hover:bg-white/20">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
