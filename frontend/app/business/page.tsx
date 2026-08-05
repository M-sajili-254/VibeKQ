'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Globe,
  MapPin,
  Plane,
  Store,
} from 'lucide-react';
import { destinationService, getItemImage } from '@/utils/api';

type CommunityKey = 'airport' | 'destination';

const communityContent: Record<CommunityKey, { title: string; icon: any; blurb: string }> = {
  airport: {
    title: 'Airport Business',
    icon: Plane,
    blurb: 'Businesses and services inside the airport environment: lounges, dining, retail, transfers, car hire, and airport hotels.',
  },
  destination: {
    title: 'Destination Business',
    icon: Store,
    blurb: 'Hotels, restaurants, tours, hospitals, pharmacies, shopping, attractions, city transport, and destination merchants.',
  },
};

export default function BusinessPage() {
  const searchParams = useSearchParams();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [ecosystem, setEcosystem] = useState<any | null>(null);
  const [community, setCommunity] = useState<CommunityKey>('airport');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll();
        const list = data.results || data || [];
        setDestinations(list);

        const byQuery = list.find(
          (destination: any) =>
            destination.id === searchParams.get('city') ||
            destination.city?.toLowerCase() === searchParams.get('city')?.toLowerCase()
        );

        setSelectedDestinationId(byQuery?.id || list[0]?.id || null);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, [searchParams]);

  useEffect(() => {
    const fetchEcosystem = async () => {
      if (!selectedDestinationId) {
        return;
      }

      setLoading(true);
      try {
        const data = await destinationService.getEcosystem(selectedDestinationId);
        setEcosystem(data);
      } catch (error) {
        console.error('Error fetching business ecosystem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEcosystem();
  }, [selectedDestinationId]);

  const selectedDestination = useMemo(
    () => ecosystem?.destination || destinations.find((destination: any) => destination.id === selectedDestinationId),
    [destinations, ecosystem, selectedDestinationId]
  );

  const activeCommunity = ecosystem?.communities?.[community] || { partners: [], services: [] };
  const CommunityIcon = communityContent[community].icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-yellow-300 text-sm font-semibold uppercase tracking-wide mb-4">
            <Globe className="w-4 h-4" />
            Business ecosystem segmentation
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            One destination, two connected business communities
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
            Every destination in Vibe with KQ now demonstrates a clearly segmented ecosystem: airport business on one side and destination business on the other — both unlocked through the passenger’s ticket.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Demonstration network</p>
              <h2 className="text-3xl font-bold text-gray-900">Localized ecosystems across the globe</h2>
            </div>
            <Link href="/ticket-login" className="inline-flex items-center gap-2 text-red-600 font-semibold">
              Unlock as a passenger
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {destinations.map((destination: any) => (
              <button
                key={destination.id}
                onClick={() => setSelectedDestinationId(destination.id)}
                className={`text-left bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition ${
                  selectedDestination?.id === destination.id ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <div className="h-44 bg-gray-100">
                  {getItemImage(destination) && (
                    <img
                      src={getItemImage(destination) || ''}
                      alt={destination.city}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.country}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{destination.city}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{destination.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedDestination && (
        <section className="py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,0.9fr] gap-8 mb-8">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="h-72 bg-gray-100">
                  {getItemImage(selectedDestination) && (
                    <img
                      src={getItemImage(selectedDestination) || ''}
                      alt={selectedDestination.city}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                      {selectedDestination.airport_code}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                      {selectedDestination.currency_code}
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-3">
                    {selectedDestination.city}, {selectedDestination.country}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">{selectedDestination.hero_tagline || selectedDestination.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-950 text-white p-5">
                      <p className="text-sm text-yellow-300 mb-2">Airport gateway</p>
                      <h3 className="text-xl font-bold">{selectedDestination.airport_name}</h3>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-5">
                      <p className="text-sm text-red-600 mb-2">Passenger promise</p>
                      <p className="text-gray-700">
                        The ticket is the entry point to one destination-specific business ecosystem before and after arrival.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-red-600 mb-2">Destination highlights</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What the ecosystem showcases</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {(selectedDestination.highlights || []).map((highlight: string) => (
                    <span key={highlight} className="px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p>Airport operators, merchants, lounges, dining, car hire, and airport hotels are separated from city businesses.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p>Destination businesses cover accommodation, restaurants, experiences, shopping, healthcare, mobility, and entertainment.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p>Passengers reach both communities directly from the same ticket-linked marketplace.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
              {(['airport', 'destination'] as CommunityKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setCommunity(key)}
                  className={`px-5 py-3 rounded-full font-semibold ${
                    community === key ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  {communityContent[key].title}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white shadow p-8 text-center text-gray-500">Loading ecosystem...</div>
            ) : (
              <div className="grid xl:grid-cols-[0.9fr,1.1fr] gap-8">
                <div className="bg-white rounded-3xl shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CommunityIcon className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{communityContent[community].title}</h3>
                      <p className="text-sm text-gray-600">{communityContent[community].blurb}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(activeCommunity.partners || []).map((partner: any) => (
                      <div key={partner.id} className="rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">
                              {partner.business_category}
                            </p>
                            <h4 className="text-xl font-bold text-gray-900">{partner.business_name}</h4>
                          </div>
                          {partner.featured && (
                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">{partner.community_summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(partner.service_tags || []).map((tag: string) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Passenger-facing services</h3>
                      <p className="text-sm text-gray-600">Products and experiences exposed to the traveler through the destination passport.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(activeCommunity.services || []).map((service: any) => (
                      <div key={service.id} className="rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">
                              {service.category_name}
                            </p>
                            <h4 className="text-xl font-bold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm text-gray-500">From</p>
                            <p className="text-2xl font-black text-red-700">{parseFloat(service.price).toFixed(0)}</p>
                            <p className="text-sm text-gray-500">{service.currency}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                              {service.journey_stage_label}
                            </span>
                            {service.location_label && (
                              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                                {service.location_label}
                              </span>
                            )}
                          </div>
                          <Link href={`/trip-assistant/services/${service.id}`} className="inline-flex items-center gap-2 text-red-600 font-semibold">
                            View booking flow
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
