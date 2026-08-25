'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Globe,
  Lock,
  MapPin,
  Plane,
  Store,
  Upload,
} from 'lucide-react';
import { authService, businessService, destinationService, getItemImage } from '@/utils/api';

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

const partnerUserTypes = new Set(['business_partner', 'staff', 'admin']);

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown): string[] =>
  asArray<unknown>(value).filter((item): item is string => typeof item === 'string' && item.trim().length > 0);

const formatPrice = (value: unknown) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(0) : '—';
};

const getErrorMessage = (error: any, fallback: string) => {
  const payload = error?.response?.data;

  if (typeof payload?.error === 'string') {
    return payload.error;
  }

  if (typeof payload?.detail === 'string') {
    return payload.detail;
  }

  if (payload && typeof payload === 'object') {
    const [firstValue] = Object.values(payload);
    if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
      return firstValue[0];
    }
    if (typeof firstValue === 'string') {
      return firstValue;
    }
  }

  return fallback;
};

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

function BusinessContent() {
  const searchParams = useSearchParams();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [ecosystem, setEcosystem] = useState<any | null>(null);
  const [community, setCommunity] = useState<CommunityKey>('airport');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState('');
  const [applicationForm, setApplicationForm] = useState({
    business_name: '',
    business_category: '',
    destination: '',
    community_type: 'airport',
    service_tags: '',
    business_registration_number: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    business_website: '',
    business_description: '',
  });
  const [applicationFiles, setApplicationFiles] = useState<{
    business_logo: File | null;
    business_documents: File | null;
  }>({
    business_logo: null,
    business_documents: null,
  });

  useEffect(() => {
    const initialCommunity = searchParams.get('community');
    if (initialCommunity === 'airport' || initialCommunity === 'destination') {
      setCommunity(initialCommunity);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = readStoredUser();
      if (storedUser) {
        setCurrentUser(storedUser);
      }

      if (!localStorage.getItem('access_token')) {
        return;
      }

      try {
        const freshUser = await authService.getCurrentUser();
        setCurrentUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll();
        const list = data.results || data || [];
        setDestinations(list);

        const byQuery =
          list.find((destination: any) => destination.id === searchParams.get('destination')) ||
          list.find(
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

  useEffect(() => {
    if (!currentUser || !partnerUserTypes.has(currentUser.user_type)) {
      setApplications([]);
      return;
    }

    const fetchApplications = async () => {
      setApplicationLoading(true);
      try {
        const data = await businessService.getApplications();
        setApplications(data.results || data || []);
      } catch (error) {
        setApplicationError(getErrorMessage(error, 'Unable to load your business applications right now.'));
      } finally {
        setApplicationLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  useEffect(() => {
    setApplicationForm((current) => ({
      ...current,
      business_name: current.business_name || currentUser?.business_name || '',
      business_category: current.business_category || currentUser?.business_category || '',
      business_phone: current.business_phone || currentUser?.phone_number || '',
      business_email: current.business_email || currentUser?.email || '',
      destination: current.destination || selectedDestinationId || '',
      community_type: searchParams.get('community') === 'destination' ? 'destination' : current.community_type,
    }));
  }, [currentUser, searchParams, selectedDestinationId]);

  const selectedDestination = useMemo(
    () => ecosystem?.destination || destinations.find((destination: any) => destination.id === selectedDestinationId),
    [destinations, ecosystem, selectedDestinationId]
  );

  const activeCommunity = useMemo(
    () => ecosystem?.communities?.[community] || { partners: [], services: [] },
    [community, ecosystem]
  );

  const featuredHighlights = useMemo(
    () => asStringArray(selectedDestination?.highlights),
    [selectedDestination]
  );

  const latestApplication = applications[0] || null;
  const isPartnerUser = !!currentUser && partnerUserTypes.has(currentUser.user_type);
  const CommunityIcon = communityContent[community].icon;

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationError('');
    setApplicationSuccess('');

    if (!applicationFiles.business_logo || !applicationFiles.business_documents) {
      setApplicationError('Please upload both your business logo and supporting documents.');
      return;
    }

    setApplicationLoading(true);

    try {
      const payload = new FormData();
      payload.append('business_name', applicationForm.business_name);
      payload.append('business_category', applicationForm.business_category);
      payload.append('destination', applicationForm.destination);
      payload.append('community_type', applicationForm.community_type);
      payload.append('business_registration_number', applicationForm.business_registration_number);
      payload.append('business_address', applicationForm.business_address);
      payload.append('business_phone', applicationForm.business_phone);
      payload.append('business_email', applicationForm.business_email);
      payload.append('business_description', applicationForm.business_description);
      payload.append('business_logo', applicationFiles.business_logo);
      payload.append('business_documents', applicationFiles.business_documents);

      if (applicationForm.business_website.trim()) {
        payload.append('business_website', applicationForm.business_website.trim());
      }

      payload.append(
        'service_tags',
        JSON.stringify(
          asStringArray(
            applicationForm.service_tags
              .split(',')
              .map((tag) => tag.trim())
          )
        )
      );

      const createdApplication = await businessService.applyForPartnership(payload);
      setApplications((current) => [createdApplication, ...current]);
      setApplicationSuccess('Business details submitted successfully. Your application is now pending review.');
      setApplicationFiles({
        business_logo: null,
        business_documents: null,
      });
    } catch (error) {
      setApplicationError(getErrorMessage(error, 'Unable to submit your business details. Please review the form and try again.'));
    } finally {
      setApplicationLoading(false);
    }
  };

  const cityData = selectedCity ? businessCommunities[selectedCity] : null;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in partnering with LinkedSky. We'll review your application and get back to you within 3-5 business days.
          </p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Join our network of verified local businesses across the globe and connect with travelers through an independent, scalable platform.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/partner-login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-slate-950 font-bold hover:bg-yellow-300 transition"
            >
              Existing partner sign in
              <Lock className="w-4 h-4" />
            </Link>
            <Link
              href="/business/apply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition"
            >
              Apply for a business account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-yellow-600 font-semibold tracking-wider uppercase text-sm">Why Partner With Us</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">Partnership Benefits</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Access to Travelers</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with travelers looking for trusted local services at their destinations.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Grow Your Business</h3>
              <p className="text-gray-600 leading-relaxed">
                Increase your visibility and bookings through our verified partner network across multiple continents.
              </p>
            </div>
          </div>
        </section>
      )}

      {isPartnerUser && (
        <section className="py-12 px-4 border-b bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Partner workspace</p>
                <h2 className="text-3xl font-bold text-gray-900">Upload business data and partnership information</h2>
              </div>
              <span className="px-4 py-2 rounded-full bg-slate-950 text-white text-sm font-semibold">
                Signed in as {currentUser?.business_name || currentUser?.username}
              </span>
            </div>

            <div className="grid xl:grid-cols-[0.85fr,1.15fr] gap-8">
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Latest application</h3>

                {applicationError && (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {applicationError}
                  </div>
                )}

                {applicationSuccess && (
                  <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {applicationSuccess}
                  </div>
                )}

                {applicationLoading && !latestApplication ? (
                  <p className="text-sm text-gray-500">Loading your application status...</p>
                ) : latestApplication ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Business</p>
                        <p className="text-lg font-bold text-gray-900">{latestApplication.business_name}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase">
                        {latestApplication.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-gray-500 mb-1">Business type</p>
                        <p className="font-semibold text-gray-900">{latestApplication.community_label}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-gray-500 mb-1">Destination</p>
                        <p className="font-semibold text-gray-900">{latestApplication.destination_name || 'Not selected'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Submitted details stay attached to your partner account while the application is reviewed.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white p-5 text-sm text-gray-600">
                    No partnership application submitted yet. Complete the form to upload your business details.
                  </div>
                )}
              </div>

              <form onSubmit={handleApplicationSubmit} className="bg-white rounded-3xl shadow p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Business profile submission</h3>
                    <p className="text-sm text-gray-600">Provide the information, business type, and uploads required for review.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business name</label>
                    <input
                      required
                      value={applicationForm.business_name}
                      onChange={(e) => setApplicationForm({ ...applicationForm, business_name: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business category</label>
                    <input
                      required
                      value={applicationForm.business_category}
                      onChange={(e) => setApplicationForm({ ...applicationForm, business_category: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                    <select
                      required
                      value={applicationForm.destination}
                      onChange={(e) => {
                        setApplicationForm({ ...applicationForm, destination: e.target.value });
                        setSelectedDestinationId(e.target.value);
                      }}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    >
                      <option value="">Choose a destination</option>
                      {destinations.map((destination: any) => (
                        <option key={destination.id} value={destination.id}>
                          {destination.city}, {destination.country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business type</label>
                    <select
                      value={applicationForm.community_type}
                      onChange={(e) => {
                        const nextCommunity = e.target.value as CommunityKey;
                        setApplicationForm({ ...applicationForm, community_type: nextCommunity });
                        setCommunity(nextCommunity);
                      }}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    >
                      <option value="airport">Airport Business</option>
                      <option value="destination">Destination Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service tags</label>
                  <input
                    value={applicationForm.service_tags}
                    onChange={(e) => setApplicationForm({ ...applicationForm, service_tags: e.target.value })}
                    placeholder="lounges, transfers, safari, pharmacy"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                  <p className="text-xs text-gray-500 mt-2">Separate tags with commas.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Registration number</label>
                    <input
                      required
                      value={applicationForm.business_registration_number}
                      onChange={(e) => setApplicationForm({ ...applicationForm, business_registration_number: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business phone</label>
                    <input
                      required
                      value={applicationForm.business_phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, business_phone: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business email</label>
                    <input
                      required
                      type="email"
                      value={applicationForm.business_email}
                      onChange={(e) => setApplicationForm({ ...applicationForm, business_email: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business website</label>
                    <input
                      type="url"
                      value={applicationForm.business_website}
                      onChange={(e) => setApplicationForm({ ...applicationForm, business_website: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business address</label>
                  <textarea
                    required
                    rows={3}
                    value={applicationForm.business_address}
                    onChange={(e) => setApplicationForm({ ...applicationForm, business_address: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business description</label>
                  <textarea
                    required
                    rows={4}
                    value={applicationForm.business_description}
                    onChange={(e) => setApplicationForm({ ...applicationForm, business_description: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business logo</label>
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={(e) => setApplicationFiles({ ...applicationFiles, business_logo: e.target.files?.[0] || null })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supporting documents</label>
                    <input
                      required
                      type="file"
                      onChange={(e) => setApplicationFiles({ ...applicationFiles, business_documents: e.target.files?.[0] || null })}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={applicationLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-white font-bold hover:bg-red-700 transition disabled:opacity-60"
                >
                  {applicationLoading ? 'Submitting business details...' : 'Submit business details'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

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

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-semibold text-gray-600">Business type:</span>
            {(['airport', 'destination'] as CommunityKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setCommunity(key)}
                className={`px-5 py-3 rounded-full font-semibold transition ${
                  community === key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                }`}
              >
                {communityContent[key].title}
              </button>
            ))}
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
                  <div className="mt-4 flex gap-2 flex-wrap text-xs font-semibold">
                    <span className="px-3 py-1 rounded-full bg-slate-950 text-white">
                      {destination.airport_services_count || 0} airport services
                    </span>
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700">
                      {destination.destination_services_count || 0} destination services
                    </span>
                  </div>
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
                    <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-sm font-semibold">
                      Viewing {communityContent[community].title}
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
                  {featuredHighlights.map((highlight) => (
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
                    <p>Customers can switch between airport and destination business views to compare the two communities for the same city.</p>
                  </div>
                </div>
              </div>
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
                    {asArray<any>(activeCommunity.partners).map((partner) => (
                      <div key={partner.id} className="rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">
                              {partner.business_category}
                            </p>
                            <h4 className="text-xl font-bold text-gray-900">{partner.business_name}</h4>
                          </div>
                          <div className="flex gap-2 flex-wrap justify-end">
                            {partner.featured && (
                              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                                Featured
                              </span>
                            )}
                            {partner.community_label && (
                              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                                {partner.community_label}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">{partner.community_summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {asStringArray(partner.service_tags).map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {asArray(activeCommunity.partners).length === 0 && (
                      <div className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
                        No partners are currently listed for this business type in the selected destination.
                      </div>
                    )}
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
                    {asArray<any>(activeCommunity.services).map((service) => (
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
                            <p className="text-2xl font-black text-red-700">{formatPrice(service.price)}</p>
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
                            {service.community_label && (
                              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                                {service.community_label}
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

                    {asArray(activeCommunity.services).length === 0 && (
                      <div className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
                        No services are currently listed for this business type in the selected destination.
                      </div>
                    )}
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

export default function BusinessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BusinessContent />
    </Suspense>
  );
}
