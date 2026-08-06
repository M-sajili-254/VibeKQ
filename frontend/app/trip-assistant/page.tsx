'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle,
  CreditCard,
  Globe,
  Lock,
  MapPin,
  Plane,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { destinationService, getItemImage } from '@/utils/api';

type CommunityKey = 'airport' | 'destination';

const communityLabels: Record<CommunityKey, string> = {
  airport: 'Airport Business',
  destination: 'Destination Business',
};

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown): string[] =>
  asArray<unknown>(value).filter((item): item is string => typeof item === 'string' && item.trim().length > 0);

const formatPreference = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'Not set';
  }

  return value.replaceAll('_', ' ');
};

const formatPrice = (value: unknown): string => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(0) : '—';
};

function TripAssistantContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destinations, setDestinations] = useState<any[]>([]);
  const [passport, setPassport] = useState<any | null>(null);
  const [ecosystem, setEcosystem] = useState<any | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(searchParams.get('destination'));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ecosystemLoading, setEcosystemLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
  }, []);

  useEffect(() => {
    const destinationFromQuery = searchParams.get('destination');
    if (destinationFromQuery) {
      setSelectedDestinationId(destinationFromQuery);
    } else {
      setSelectedDestinationId((current) => current ?? null);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll();
        const destinationResults = data.results || data || [];
        setDestinations(destinationResults);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchPassport = async () => {
      if (!isAuthenticated) {
        setPassport(null);
        setLoading(false);
        return;
      }

      try {
        const data = await destinationService.getPassport();
        setPassport(data);
        setSelectedDestinationId((current) => current || data.destination?.id || null);
      } catch (error) {
        console.error('Error fetching destination passport:', error);
        setPassport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPassport();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchEcosystem = async () => {
      if (!selectedDestinationId) {
        setEcosystem(null);
        if (!isAuthenticated) {
          setLoading(false);
        }
        return;
      }

      if (passport?.destination?.id === selectedDestinationId) {
        setEcosystem(null);
        return;
      }

      setEcosystemLoading(true);
      try {
        const data = await destinationService.getEcosystem(selectedDestinationId);
        setEcosystem(data);
      } catch (error) {
        console.error('Error fetching destination ecosystem:', error);
      } finally {
        setEcosystemLoading(false);
        setLoading(false);
      }
    };

    fetchEcosystem();
  }, [selectedDestinationId, passport, isAuthenticated]);

  const selectedDestination = useMemo(() => {
    if (ecosystem?.destination?.id === selectedDestinationId) {
      return ecosystem.destination;
    }

    if (passport?.destination?.id === selectedDestinationId) {
      return passport.destination;
    }

    return (
      destinations.find((destination: any) => destination.id === selectedDestinationId) ||
      null
    );
  }, [destinations, ecosystem, passport, selectedDestinationId]);

  const communities = useMemo(() => {
    if (passport?.destination?.id === selectedDestinationId) {
      return passport?.communities || null;
    }

    if (ecosystem?.destination?.id === selectedDestinationId) {
      return ecosystem?.communities || null;
    }

    return null;
  }, [ecosystem, passport, selectedDestinationId]);

  const filteredCommunities = useMemo(() => {
    if (!communities) {
      return null;
    }

    const filterByCategory = (services: any[]) => {
      if (!selectedCategory) {
        return services;
      }
      return services.filter((service) => service.category === selectedCategory);
    };

    return {
      airport: {
        partners: asArray(communities.airport?.partners),
        services: filterByCategory(asArray(communities.airport?.services)),
      },
      destination: {
        partners: asArray(communities.destination?.partners),
        services: filterByCategory(asArray(communities.destination?.services)),
      },
    };
  }, [communities, selectedCategory]);

  const recommendations = useMemo(() => asArray(passport?.recommendations), [passport]);
  const categories = useMemo(() => {
    const sourceServices = [
      ...asArray<any>(communities?.airport?.services),
      ...asArray<any>(communities?.destination?.services),
    ];
    const seen = new Map<string, string>();
    sourceServices.forEach((service: any) => {
      if (typeof service?.category === 'string' && !seen.has(service.category)) {
        seen.set(service.category, service.category_name || service.category);
      }
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [communities]);

  const activeTips = useMemo(() => {
    if (!selectedDestination) {
      return [];
    }

    const beforeArrivalTips = asStringArray(selectedDestination.before_arrival_tips);
    const afterArrivalTips = asStringArray(selectedDestination.after_arrival_tips);

    return [
      { title: 'Before arrival', items: beforeArrivalTips },
      { title: 'After landing', items: afterArrivalTips },
    ].filter((tipBlock) => tipBlock.items.length > 0);
  }, [selectedDestination]);

  const handleDestinationClick = (destinationId: string) => {
    setSelectedDestinationId(destinationId);
    setSelectedCategory(null);
    const section = document.getElementById('destination-passport');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination passport...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-medium text-yellow-300">
            <Sparkles className="w-4 h-4" />
            <span>Single ticket. Single destination. One connected marketplace.</span>
          </div>

          <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 items-start">
            <div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                {passport?.destination
                  ? `${passport.destination.city} destination passport unlocked`
                  : 'Turn every ticket into a digital destination passport'}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mb-8">
                {passport?.destination
                  ? `Your ticket now opens the full ${passport.destination.city} ecosystem — airport services, trusted destination businesses, personalized recommendations, and direct payment-ready booking.`
                  : 'Browse global demo destinations and see how a Kenya Airways ticket becomes the passenger’s entry point to one localized ecosystem before and after arrival.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {passport ? (
                  <button
                    onClick={() => document.getElementById('destination-passport')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-slate-950 font-bold rounded-full hover:bg-yellow-300 transition"
                  >
                    Open My Destination
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/ticket-login')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-slate-950 font-bold rounded-full hover:bg-yellow-300 transition"
                  >
                    Login with Ticket
                    <Ticket className="w-5 h-5" />
                  </button>
                )}
                <Link
                  href="/business"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 rounded-full font-semibold hover:bg-white/20 transition"
                >
                  Explore Business Communities
                  <Briefcase className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-4">What this destination passport includes</h2>
              <div className="grid gap-4 text-sm text-gray-100">
                <div className="flex gap-3">
                  <Plane className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Airport business</p>
                    <p>Lounges, airport dining, retail, transfers, hotels, and other services inside the airport environment.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Destination business</p>
                    <p>Hotels, transport, restaurants, tours, shopping, healthcare, events, and destination merchants beyond the airport.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CreditCard className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Marketplace and payments</p>
                    <p>Book, reserve, and pay for products and services through one consistent checkout flow.</p>
                  </div>
                </div>
              </div>

              {passport?.ticket && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-300 mb-2">Active ticket</p>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-white">{passport.ticket.ticket_number}</p>
                    <p>{passport.ticket.flight_number} • {passport.ticket.destination}</p>
                    <p className="text-gray-300">Marketplace ready: {passport.marketplace?.ready_for_checkout ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Global demonstration destinations</p>
              <h2 className="text-3xl font-bold text-gray-900">Choose a destination ecosystem</h2>
            </div>
            {!passport && (
              <button
                onClick={() => router.push('/ticket-login')}
                className="inline-flex items-center gap-2 text-red-600 font-semibold"
              >
                <Lock className="w-4 h-4" />
                Unlock with your ticket
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {destinations.map((destination: any) => (
              <button
                key={destination.id}
                onClick={() => handleDestinationClick(destination.id)}
                className={`text-left rounded-3xl overflow-hidden bg-white shadow hover:shadow-xl transition ${
                  selectedDestination?.id === destination.id ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <div className="h-48 bg-gray-200 relative">
                  {getItemImage(destination) && (
                    <img
                      src={getItemImage(destination) || ''}
                      alt={destination.city}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {destination.featured && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-400 text-slate-900 text-xs font-bold">
                      Demo
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Globe className="w-4 h-4" />
                    <span>{destination.country}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{destination.city}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{destination.hero_tagline || destination.description}</p>
                  <div className="mt-4 flex gap-2 flex-wrap text-xs font-semibold">
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-700">{destination.airport_services_count} airport services</span>
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700">{destination.destination_services_count} destination services</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedDestination && (
        <section id="destination-passport" className="py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid xl:grid-cols-[1.15fr,0.85fr] gap-8 mb-10">
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
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                      {selectedDestination.airport_code} • {selectedDestination.currency_code}
                    </span>
                    {passport?.destination?.id === selectedDestination.id && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Active ticket destination
                      </span>
                    )}
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-3">
                    {selectedDestination.city}, {selectedDestination.country}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {selectedDestination.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-950 text-white p-5">
                      <p className="text-sm text-yellow-300 mb-2">Airport gateway</p>
                      <h3 className="text-xl font-bold">{selectedDestination.airport_name}</h3>
                      <p className="mt-2 text-sm text-gray-300">
                        Services inside the airport environment for before departure and after landing.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 p-5">
                      <p className="text-sm text-red-600 mb-2">Destination city</p>
                      <h3 className="text-xl font-bold text-gray-900">{selectedDestination.city} destination business ecosystem</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Hotels, transport, food, attractions, shopping, events, and wellness beyond the airport.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {passport?.profile && (
                  <div className="bg-white rounded-3xl shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-red-600" />
                      <h3 className="text-xl font-bold text-gray-900">Personalized traveler profile</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-gray-500">Budget</p>
                        <p className="font-semibold text-gray-900">{formatPreference(passport.profile.preferred_budget)}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-gray-500">Travel frequency</p>
                        <p className="font-semibold text-gray-900">{formatPreference(passport.profile.travel_frequency)}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {asStringArray(passport.profile.interests).map((interest: string) => (
                            <span key={interest} className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-medium">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link href="/profile" className="inline-flex items-center gap-2 text-red-600 font-semibold">
                        Refine my profile
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-3xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <h3 className="text-xl font-bold text-gray-900">Before and after arrival</h3>
                  </div>
                  <div className="space-y-4">
                    {activeTips.map((tipBlock: any) => (
                      <div key={tipBlock.title}>
                        <p className="font-semibold text-gray-900 mb-2">{tipBlock.title}</p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {tipBlock.items.map((item: string) => (
                            <li key={item} className="flex gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="mb-10">
                <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-600">For this passenger</p>
                    <h3 className="text-3xl font-bold text-gray-900">Recommended immediately after landing</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {recommendations.slice(0, 4).map((service: any) => (
                    <div key={service.id} className="bg-white rounded-3xl shadow p-5">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                          Score {service.recommendation_score ?? '—'}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">{service.community_label}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{service.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {asStringArray(service.recommendation_reasons).map((reason: string) => (
                          <span key={reason} className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                            {reason}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/trip-assistant/services/${service.id}`}
                          className="inline-flex items-center gap-2 text-red-600 font-semibold"
                        >
                          View service
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Marketplace</p>
                <h3 className="text-3xl font-bold text-gray-900">Segmented business communities</h3>
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      !selectedCategory ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                    }`}
                  >
                    All categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedCategory === category.id ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {ecosystemLoading ? (
              <div className="text-center py-12 text-gray-500">Loading destination communities...</div>
            ) : filteredCommunities ? (
              <div className="grid xl:grid-cols-2 gap-8">
                {(['airport', 'destination'] as CommunityKey[]).map((communityKey) => (
                  <div key={communityKey} className="bg-white rounded-3xl shadow-lg p-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                          {communityLabels[communityKey]}
                        </p>
                        <h4 className="text-2xl font-bold text-gray-900">
                          {filteredCommunities[communityKey]?.services?.length || 0} services available
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                        {filteredCommunities[communityKey]?.partners?.length || 0} partners
                      </span>
                    </div>

                    <div className="space-y-4">
                      {(filteredCommunities[communityKey]?.services || []).map((service: any) => (
                        <div key={service.id} className="rounded-2xl border border-gray-100 p-4 hover:border-red-200 transition">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">
                                {service.category_name}
                              </p>
                              <h5 className="text-lg font-bold text-gray-900">{service.name}</h5>
                              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                  {service.journey_stage_label}
                                </span>
                                {service.location_label && (
                                  <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                                    {service.location_label}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm text-gray-500">From</p>
                              <p className="text-2xl font-black text-red-700">
                                {formatPrice(service.price)}
                              </p>
                              <p className="text-sm text-gray-500">{service.currency}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                            <p className="text-xs text-gray-500">by {service.provider_name}</p>
                            {isAuthenticated ? (
                              <Link
                                href={`/trip-assistant/services/${service.id}`}
                                className="inline-flex items-center gap-2 text-red-600 font-semibold"
                              >
                                Book now
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            ) : (
                              <button
                                onClick={() => router.push('/ticket-login')}
                                className="inline-flex items-center gap-2 text-red-600 font-semibold"
                              >
                                Unlock with ticket
                                <Lock className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {(filteredCommunities[communityKey]?.services || []).length === 0 && (
                      <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">
                        No services match the current category filter for this community.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white shadow p-8 text-center text-gray-600">
                Select a destination to load its business ecosystem.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default function TripAssistant() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <TripAssistantContent />
    </Suspense>
  );
}
