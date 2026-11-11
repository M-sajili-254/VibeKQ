'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, MapPin, Search } from 'lucide-react';
import PhotoGallery from '@/components/PhotoGallery';
import { businessService, destinationService } from '@/utils/api';
import type { Merchant } from '@/utils/marketplace';
import { discoveryCategories, rwandaExamples, type DiscoveryCategory } from './rwanda-content';

export default function RwandaDiscovery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<DiscoveryCategory | 'all'>('all');
  const [showAll, setShowAll] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([destinationService.getAll(), businessService.getPartnerships()])
      .then(([destinations, partners]) => {
        if (cancelled) return;
        const rwandaIds = new Set(destinations.filter((destination) => destination.country.toLowerCase() === 'rwanda').map((destination) => destination.id));
        setMerchants(partners.filter((partner) => !partner.is_demo && rwandaIds.has(partner.destination)));
      })
      .catch((error: unknown) => {
        console.error('Unable to load Rwanda businesses:', error);
        if (!cancelled) setError('Approved business profiles could not be loaded. Demonstration ideas below remain available.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [retry]);

  const search = query.toLowerCase().trim();
  const filtered = rwandaExamples.filter((example) =>
    (category === 'all' || example.category === category) &&
    `${example.title} ${example.description} ${example.location} ${example.offerings.join(' ')}`.toLowerCase().includes(search)
  );
  const highlights = discoveryCategories.map((value) =>
    rwandaExamples.find((example) => example.category === value && example.featured) ||
    rwandaExamples.find((example) => example.category === value)!
  );
  const visible = category === 'all' && !search && !showAll ? highlights : filtered;
  const matchingMerchants = merchants.filter((merchant) =>
    `${merchant.business_name} ${merchant.business_category} ${merchant.community_summary || ''} ${merchant.service_tags.join(' ')}`.toLowerCase().includes(search)
  );

  return (
    <div className="space-y-10">
      <section aria-labelledby="rwanda-business-value" className="grid gap-6 rounded-2xl border border-brand-100 bg-white p-6 md:grid-cols-[1.5fr,1fr] md:p-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">For Rwanda's business community</p>
          <h2 id="rwanda-business-value" className="text-2xl font-bold text-gray-900">Get discovered. Showcase what you do.</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">Give travelers and local customers a window into your products, services and spaces. A business profile brings your story, real photos and service offerings together, helping customers discover your company and begin a conversation.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-primary">
            {['Business visibility', 'Product & service showcases', 'Venue discovery', 'Promotions & announcements'].map((value) => <span key={value} className="rounded-full bg-primary/10 px-3 py-2">{value}</span>)}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-3">
          <Link href="/business/apply" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90">List your business <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/partner-login" className="text-sm font-semibold text-primary hover:underline">Existing business? Manage your profile</Link>
          <p className="text-xs leading-relaxed text-gray-500">Submit through the existing partner portal for review. No advertising results, enquiries or bookings are guaranteed.</p>
        </div>
      </section>

      <section aria-labelledby="rwanda-discovery-heading">
        <div className="mb-6">
          <h2 id="rwanda-discovery-heading" className="text-2xl font-bold text-gray-900">Find your Rwanda inspiration</h2>
          <p className="mt-2 text-sm text-gray-600">Browse events, heritage, businesses, venues, adventures and local products.</p>
        </div>
        <label className="relative mb-4 block">
          <span className="sr-only">Search Rwanda discovery and businesses</span>
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try coffee, Intore, boardrooms, IT or Lake Kivu..." className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </label>
        <div aria-label="Discovery categories" className="flex flex-wrap gap-2">
          {(['all', ...discoveryCategories] as const).map((value) => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setShowAll(false); }} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === value ? 'bg-primary text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-brand-50'}`}>{value === 'all' ? 'Highlights' : value}</button>)}
        </div>

        <div role="note" className="my-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>Discovery demonstrations, not verified listings.</strong> Names and offerings below illustrate what could be featured. Photos are illustrative stock imagery, not photographs of the named businesses, venues or Rwanda attractions. No dates, availability, prices or promotions are confirmed. Formula 1 content is a fan-viewing concept, not a Rwanda-hosted Grand Prix.
        </div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{category === 'all' ? 'Rwanda discovery ideas' : category}</h3>
          <p role="status" className="text-xs text-gray-500">Showing {visible.length} of {filtered.length} matching demonstration ideas</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((example) => <article key={example.title} className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg">
            <PhotoGallery name={example.title} images={[example.image]} label="Illustrative photo" className="h-44" />
            <div className="p-6">
              <div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Demonstration {example.category === 'Events & entertainment' ? 'event concept' : 'example'}</span><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{example.category}</span></div>
              <h4 className="text-xl font-semibold text-gray-900">{example.title}</h4>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3 w-3 shrink-0" />{example.location}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{example.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">{example.offerings.map((offering) => <span key={offering} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{offering}</span>)}</div>
              <Link href="/business/apply" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Offer something like this? List your business <ArrowRight className="h-4 w-4 shrink-0" /></Link>
            </div>
          </article>)}
        </div>
        {visible.length === 0 && <div className="rounded-lg bg-white p-8 text-center"><p className="text-gray-600">No discovery ideas match your search in this category.</p><button type="button" onClick={() => { setQuery(''); setCategory('all'); }} className="mt-3 font-semibold text-primary hover:underline">Clear search and filters</button></div>}
        {category === 'all' && !search && <div className="mt-6 text-center"><button type="button" onClick={() => setShowAll((value) => !value)} className="rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-brand-50">{showAll ? 'Show fewer ideas' : `Explore all ${rwandaExamples.length} ideas`}</button></div>}
      </section>

      <section aria-labelledby="approved-rwanda-businesses">
        <div className="mb-6">
          <h2 id="approved-rwanda-businesses" className="flex items-center gap-2 text-2xl font-bold text-gray-900"><Building2 className="h-6 w-6 text-primary" />Approved Rwanda business profiles</h2>
          <p className="mt-2 text-sm text-gray-600">Separate from the examples above. These profiles come from the existing partner directory; the search applies here too. Discovery category filters apply only to demonstration ideas.</p>
        </div>
        {loading ? <p role="status" className="rounded-lg bg-white p-6 text-gray-500">Loading Rwanda business profiles...</p> : error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{error} <button type="button" onClick={() => setRetry((value) => value + 1)} className="ml-2 font-semibold underline">Retry businesses</button></div> : matchingMerchants.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{matchingMerchants.map((merchant) => <article key={merchant.id} className="overflow-hidden rounded-lg bg-white shadow">
            <PhotoGallery name={merchant.business_name} images={(merchant.photos || []).map((photo) => photo.image)} />
            <div className="p-6"><span className="text-xs font-semibold text-green-700">Approved business profile</span><h3 className="mt-2 text-xl font-semibold text-gray-900">{merchant.business_name}</h3><p className="mt-1 text-sm text-primary">{merchant.business_category} · {merchant.destination_name}</p><p className="mt-3 text-sm text-gray-600">{merchant.community_summary}</p><div className="mt-4 flex flex-wrap gap-2">{merchant.service_tags.map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{tag}</span>)}</div><Link href={`/business?destination=${encodeURIComponent(merchant.destination)}&community=${encodeURIComponent(merchant.community_type)}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">View business community <ArrowRight className="h-4 w-4" /></Link></div>
          </article>)}</div>
        ) : <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6"><p className="text-sm text-gray-600">{merchants.length ? 'No approved business profiles match your search.' : 'No approved Rwanda businesses are listed yet. Be among the first to submit your business and real photos for review.'}</p><Link href="/business/apply" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">Start a business listing <ArrowRight className="h-4 w-4" /></Link></div>}
        <p className="mt-4 text-xs leading-relaxed text-gray-500">Direct enquiries and WhatsApp links are not available in the current public partner API. We do not invent contact details. Venue capacities, offers and availability must be confirmed by the business; the existing portal supports business details and photo submissions, not public venue booking or advertising campaign purchases.</p>
      </section>
    </div>
  );
}
