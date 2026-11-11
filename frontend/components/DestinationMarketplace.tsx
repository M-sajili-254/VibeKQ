'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Search, Plane, Store } from 'lucide-react';
import { businessService, destinationService, getItemImage } from '@/utils/api';
import { Destination, Ecosystem, Merchant, sortDestinations } from '@/utils/marketplace';
import PhotoGallery from './PhotoGallery';

export default function DestinationMarketplace({ destinationId, compact = false }: { destinationId?: string; compact?: boolean }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [network, setNetwork] = useState<Merchant[]>([]);
  const [selectedId, setSelectedId] = useState(destinationId || '');
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [ecosystemLoading, setEcosystemLoading] = useState(false);
  const [error, setError] = useState('');
  const [ecosystemError, setEcosystemError] = useState('');
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState('');
  const [community, setCommunity] = useState('all');
  const [category, setCategory] = useState('all');
  const [photosOnly, setPhotosOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([destinationService.getAll(), businessService.getPartnerships()]).then(([cities, merchants]) => {
      if (cancelled) return;
      const ordered = sortDestinations(cities);
      setDestinations(ordered);
      setNetwork(merchants);
      setSelectedId(destinationId || ordered[0]?.id || '');
    }).catch((error: unknown) => {
      console.error('Unable to load marketplace:', error);
      if (!cancelled) setError('The marketplace could not be loaded. Please try again.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destinationId, retry]);

  useEffect(() => {
    if (!selectedId || !destinations.some((city) => city.id === selectedId)) return;
    let cancelled = false;
    setEcosystemLoading(true);
    setEcosystem(null);
    setEcosystemError('');
    setQuery('');
    setCategory('all');
    destinationService.getEcosystem(selectedId).then((data: Ecosystem) => {
      if (!cancelled) setEcosystem(data);
    }).catch((error: unknown) => {
      console.error('Unable to load destination marketplace:', error);
      if (!cancelled) setEcosystemError('This destination could not be loaded. Please try again.');
    }).finally(() => { if (!cancelled) setEcosystemLoading(false); });
    return () => { cancelled = true; };
  }, [selectedId, destinations]);

  const selected = destinations.find((city) => city.id === selectedId);
  const liveMerchants = network.filter((merchant) => !merchant.is_demo);
  const photographedMerchants = liveMerchants.filter((merchant) => merchant.photos?.length);
  const partners = useMemo(() => {
    if (!ecosystem) return [];
    return [...ecosystem.communities.airport.partners, ...ecosystem.communities.destination.partners]
      .sort((a, b) => Number(a.is_demo) - Number(b.is_demo) || Number(!!b.photos?.length) - Number(!!a.photos?.length));
  }, [ecosystem]);
  const services = useMemo(() => ecosystem ? [...ecosystem.communities.airport.services, ...ecosystem.communities.destination.services] : [], [ecosystem]);
  const categories = [...new Set(services.map((service) => service.category_name))].sort();
  const matches = (text: string, type: string) => (community === 'all' || type === community) && text.toLowerCase().includes(query.toLowerCase().trim());
  const visiblePartners = partners.filter((merchant) => matches(`${merchant.business_name} ${merchant.business_category} ${merchant.service_tags.join(' ')}`, merchant.community_type) && (!photosOnly || (!merchant.is_demo && merchant.photos?.length)));
  const visibleServices = services.filter((service) => matches(`${service.name} ${service.category_name} ${service.provider_name} ${service.location_label}`, service.community_type) && (category === 'all' || service.category_name === category) && (!photosOnly || (!service.is_demo && getItemImage(service))));
  const merchantCards = compact ? visiblePartners.slice(0, 6) : visiblePartners;
  const serviceCards = compact ? visibleServices.slice(0, 6) : visibleServices;

  return (
    <section id="marketplace" className="bg-gray-50 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">Local people. More possibilities.</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{destinationId ? `Discover ${selected?.city || 'your destination'}` : 'Your next destination, connected.'}</h2>
            <p className="mt-4 max-w-2xl text-slate-600">Explore the businesses behind the journey. Kigali leads our pilot focus, alongside Nairobi, New York, Bangkok and the wider catalogue.</p>
          </div>
          <Link href="/business/apply" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-brand-900">List your business <ArrowRight className="h-4 w-4" /></Link>
        </div>

        {!loading && !error && <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            [destinations.length, 'Catalogue destinations'],
            [liveMerchants.length, 'Approved non-demo merchants'],
            [photographedMerchants.length, 'Merchants with uploaded photos'],
            [network.filter((merchant) => merchant.is_demo).length, 'Demo businesses · separate from live'],
          ].map(([value, label]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-3xl font-black text-brand-900">{value}</p><p className="mt-1 text-xs text-slate-600">{label}</p></div>)}
        </div>}
        <p className="mb-6 text-xs text-slate-500">Pilot coverage is not an airline route map. Demo businesses, prices and destination imagery are illustrative, not evidence of merchant onboarding or bookings.</p>
        {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">{error} <button onClick={() => setRetry((value) => value + 1)} className="ml-2 underline">Retry</button></div>}
        {loading && <p role="status" className="py-12 text-center text-slate-600">Loading destinations and merchant communities...</p>}
        {!loading && !error && <>
          {!destinationId && <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((city) => (
              <button key={city.id} type="button" aria-pressed={selectedId === city.id} onClick={() => setSelectedId(city.id)} className={`group relative min-h-52 overflow-hidden rounded-2xl text-left ${selectedId === city.id ? 'ring-4 ring-brand-600 ring-offset-4' : 'hover:ring-2 hover:ring-brand-400'}`}>
                {getItemImage(city) ? <img src={getItemImage(city) || ''} alt={`${city.city} destination`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-slate-900" />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="relative flex min-h-52 flex-col justify-end p-5 text-white">
                  <span className="mb-2 w-fit rounded-full bg-white/15 px-3 py-1 text-xs">{city.city === 'Kigali' ? 'Kigali pilot · onboarding open' : city.is_demo ? 'Pilot / demo destination' : 'Catalogue destination'}</span>
                  <h3 className="text-2xl font-bold">{city.city}</h3><p className="text-sm text-white/80">{city.country} · {city.airport_code}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold">Explore community <ArrowRight className="h-4 w-4" /></span>
                </div>
              </button>
            ))}
          </div>}
          {!selected && <p role="status" className="rounded-2xl bg-white p-6 text-slate-600">{destinationId ? 'This destination is not in the catalogue.' : 'No destinations are available yet.'} <Link href="/destinations" className="font-semibold text-primary underline">Browse destinations</Link></p>}
          {selected && <>
            <div className="mb-8 grid gap-6 rounded-3xl bg-slate-950 p-6 text-white md:grid-cols-[1.5fr,1fr] md:p-10">
              <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">{selected.airport_code} · Airport to city</p><h3 className="text-3xl font-black md:text-4xl">A local welcome to {selected.city}.</h3><p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">{selected.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">{selected.highlights.map((highlight) => <span key={highlight} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">{highlight}</span>)}</div>
              </div>
              <div className="flex flex-col justify-center gap-4 rounded-2xl bg-white/5 p-6"><div className="flex gap-3"><Plane className="h-5 w-5 shrink-0 text-brand-300" /><div><p className="font-semibold">{selected.airport_name}</p><p className="mt-1 text-xs text-slate-400">Arrival essentials and airport businesses</p></div></div><div className="flex gap-3"><Store className="h-5 w-5 shrink-0 text-amber-300" /><div><p className="font-semibold">Meet the city beyond arrivals</p><p className="mt-1 text-xs text-slate-400">Dining, shops, stays and local experiences</p></div></div><Link href={`/destinations/${selected.id}`} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">Open destination page <ArrowRight className="h-4 w-4" /></Link></div>
            </div>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <label className="relative min-w-56 flex-1"><span className="sr-only">Search merchants and experiences</span><Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search shops, restaurants, experiences..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900" /></label>
              <label><span className="sr-only">Business community</span><select value={community} onChange={(event) => setCommunity(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900"><option value="all">All communities</option><option value="airport">Airport businesses</option><option value="destination">City businesses</option></select></label>
              <label><span className="sr-only">Experience category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900"><option value="all">All experiences</option>{categories.map((name) => <option key={name}>{name}</option>)}</select></label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={photosOnly} onChange={(event) => setPhotosOnly(event.target.checked)} />Non-demo photos only</label>
            </div>
            {ecosystemLoading ? <p role="status" className="py-12 text-center text-slate-600">Loading {selected.city} businesses...</p> : ecosystemError ? <p role="alert" className="rounded-2xl bg-red-50 p-6 text-red-800">{ecosystemError} <button onClick={() => setDestinations((cities) => [...cities])} className="underline">Retry</button></p> : ecosystem && <>
              <div className="mb-6 flex items-end justify-between gap-4"><div><h3 className="text-2xl font-bold text-slate-950">Meet the business community</h3><p className="mt-2 text-sm text-slate-600">{visiblePartners.length} matching businesses · merchant-submitted photos appear after approval</p></div></div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {merchantCards.map((merchant) => <article key={merchant.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <PhotoGallery name={merchant.business_name} images={(merchant.photos || []).map((photo) => photo.image)} />
                  <div className="p-6"><span className={`text-xs font-bold ${merchant.is_demo ? 'text-amber-700' : 'text-primary'}`}>{merchant.is_demo ? 'DEMO BUSINESS' : 'APPROVED MERCHANT'}</span><h4 className="mt-2 text-xl font-bold text-slate-950">{merchant.business_name}</h4><p className="mt-1 text-sm text-primary">{merchant.business_category}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{merchant.community_summary}</p><div className="mt-4 flex flex-wrap gap-2">{merchant.service_tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{tag}</span>)}</div><Link href={`/business?destination=${selected.id}&community=${merchant.community_type}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">View community <ArrowRight className="h-4 w-4" /></Link></div>
                </article>)}
              </div>
              {visiblePartners.length === 0 && <div className="rounded-2xl border border-dashed border-brand-300 bg-white p-8"><h4 className="text-xl font-bold text-slate-900">{partners.length ? 'No businesses match these filters.' : `Be part of ${selected.city}'s first merchant community.`}</h4><p className="my-3 text-sm text-slate-600">{partners.length ? 'Try another search or turn off the photo filter.' : 'Merchant onboarding is open. Approved businesses and their real photos will appear here; no live merchant activity is claimed yet.'}</p><Link href="/business/apply" className="font-semibold text-primary underline">Start merchant onboarding</Link></div>}
              <div className="mb-6 mt-12"><h3 className="text-2xl font-bold text-slate-950">Stays, dining & things to do</h3><p className="mt-2 text-sm text-slate-600">{visibleServices.length} matching services. Demo listings use illustrative images and sample prices.</p></div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{serviceCards.map((service) => <article key={service.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <PhotoGallery images={getItemImage(service) ? [getItemImage(service)!] : []} name={service.name} label={service.is_demo ? 'Demo · illustrative destination photo' : 'Service photo'} />
                <div className="p-6"><p className="text-xs font-bold uppercase tracking-wide text-primary">{service.category_name}</p><Link href={`/trip-assistant/services/${service.id}`} className="mt-2 block text-xl font-bold text-slate-950 hover:text-primary">{service.name}</Link><p className="mt-2 text-xs text-slate-500">By {service.provider_name}</p><p className="mt-3 line-clamp-2 text-sm text-slate-600">{service.description}</p><p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{service.location_label || selected.city}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><p className="text-sm font-bold text-slate-900">{service.is_demo ? 'Sample' : 'From'} {service.currency} {Number(service.price).toLocaleString()}</p><Link href={`/trip-assistant/services/${service.id}`} aria-label={`View ${service.name}`} className="rounded-full bg-brand-50 p-2 text-primary"><ArrowRight className="h-5 w-5" /></Link></div></div>
              </article>)}</div>
              {visibleServices.length === 0 && <p className="rounded-2xl bg-white p-6 text-sm text-slate-600">{services.length ? 'No experiences match these filters.' : 'Service listings will appear as the destination catalogue grows.'}</p>}
              {compact && <div className="mt-8 text-center"><Link href={`/destinations/${selected.id}`} className="inline-flex items-center gap-2 rounded-full border border-brand-800 px-6 py-3 font-semibold text-primary hover:bg-brand-50">Explore all of {selected.city} <ArrowRight className="h-4 w-4" /></Link></div>}
            </>}
          </>}
        </>}
      </div>
    </section>
  );
}
