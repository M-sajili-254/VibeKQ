'use client';

import { useEffect, useRef, useState } from 'react';

export default function MerchantPhotoUpload({ files, confirmed, onFilesChange, onConfirmedChange }: {
  files: File[];
  confirmed: boolean;
  onFilesChange: (files: File[]) => void;
  onConfirmedChange: (confirmed: boolean) => void;
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    if (files.length === 0 && inputRef.current) inputRef.current.value = '';
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  return (
    <fieldset className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
      <legend className="px-2 font-bold text-slate-900">Show travelers your real business</legend>
      <p id="merchant-photo-help" className="mb-4 text-sm text-slate-600">Upload your storefront, dining space, rooms, products, tours or transfer vehicles. Up to 8 JPEG, PNG or WebP photos, 8 MB each. The first photo is your cover. Photos are published only after approval.</p>
      <label htmlFor="merchant-photos" className="mb-2 block text-sm font-semibold text-slate-700">Business photos</label>
      <input ref={inputRef} id="merchant-photos" type="file" multiple accept="image/jpeg,image/png,image/webp" aria-describedby="merchant-photo-help" className="w-full text-sm" onChange={(event) => {
        const next = Array.from(event.target.files || []);
        if (next.length > 8 || next.some((file) => file.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
          setError('Choose up to 8 JPEG, PNG or WebP photos, each 8 MB or smaller.');
          event.target.value = '';
          return;
        }
        setError('');
        onFilesChange(next);
      }} />
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {previews.length > 0 && <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{previews.map((url, index) => (
        <div key={url}><img src={url} alt={`Business photo preview ${index + 1}`} className="h-24 w-full rounded-xl object-cover" /><p className="mt-1 truncate text-xs text-slate-600">{index === 0 ? 'Cover: ' : ''}{files[index]?.name}</p></div>
      ))}</div>}
      {files.length > 0 && <button type="button" onClick={() => onFilesChange([])} className="my-3 text-sm font-semibold text-primary">Clear selected photos</button>}
      <label className="mt-4 flex items-start gap-3 text-sm text-slate-700">
        <input type="checkbox" checked={confirmed} onChange={(event) => onConfirmedChange(event.target.checked)} className="mt-1" />
        <span>I own these photos or have permission to publish them, and they accurately show my business.</span>
      </label>
    </fieldset>
  );
}
