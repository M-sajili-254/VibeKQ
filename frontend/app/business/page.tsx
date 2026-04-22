'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, CheckCircle, TrendingUp, Users, Globe, Star, ArrowRight } from 'lucide-react';
import { businessService } from '@/utils/api';

// Business Communities data for featured cities
const businessCommunities = {
  bangkok: {
    name: 'Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200',
    description: 'Discover authentic Thai hospitality with our verified partners in the Land of Smiles.',
    highlights: ['Street Food Tours', 'Temple Visits', 'Luxury Spas', 'River Cruises'],
    partners: [
      { name: 'Thai Comfort Tours', category: 'Adventure', rating: 4.9, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400' },
      { name: 'Bangkok River Hotels', category: 'Accommodation', rating: 4.8, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
      { name: 'Siam Transport Co.', category: 'Transport', rating: 4.7, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400' },
      { name: 'Thai Culinary Academy', category: 'Activities', rating: 4.9, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
    ]
  },
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200',
    description: 'Experience the best of Down Under with trusted Australian business partners.',
    highlights: ['Harbor Tours', 'Wildlife Experiences', 'Beach Activities', 'City Tours'],
    partners: [
      { name: 'Sydney Harbor Cruises', category: 'Adventure', rating: 4.8, image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400' },
      { name: 'Aussie Outback Tours', category: 'Adventure', rating: 4.9, image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400' },
      { name: 'Bondi Beach Hotels', category: 'Accommodation', rating: 4.7, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' },
      { name: 'Sydney Executive Cars', category: 'Transport', rating: 4.8, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400' },
    ]
  },
  rome: {
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
    description: 'Immerse yourself in Italian culture with our curated Roman experiences.',
    highlights: ['Vatican Tours', 'Cooking Classes', 'Wine Tasting', 'Historic Sites'],
    partners: [
      { name: 'Roma Antica Tours', category: 'Adventure', rating: 4.9, image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400' },
      { name: 'Tuscan Wine Experiences', category: 'Activities', rating: 4.8, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400' },
      { name: 'Roman Holiday Hotels', category: 'Accommodation', rating: 4.7, image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400' },
      { name: 'Italia Express Transport', category: 'Transport', rating: 4.6, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400' },
    ]
  },
  nairobi: {
    name: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1200',
    description: 'Your gateway to African adventures with authentic Kenyan partners.',
    highlights: ['Safari Tours', 'Cultural Experiences', 'Local Cuisine', 'Nature Walks'],
    partners: [
      { name: 'Maasai Mara Safaris', category: 'Adventure', rating: 4.9, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400' },
      { name: 'Nairobi City Lodge', category: 'Accommodation', rating: 4.8, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
      { name: 'Kenya Premier Cars', category: 'Transport', rating: 4.7, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400' },
      { name: 'African Kitchen Tours', category: 'Activities', rating: 4.8, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
    ]
  }
};

type CityKey = keyof typeof businessCommunities;
const allCities = Object.keys(businessCommunities) as CityKey[];

// Component that uses useSearchParams - must be wrapped in Suspense
function BusinessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<CityKey | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_category: '',
    business_registration_number: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    business_website: '',
    business_description: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cityParam = searchParams.get('city')?.toLowerCase() as CityKey | null;
    if (cityParam && allCities.includes(cityParam)) {
      setSelectedCity(cityParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await businessService.applyForPartnership(formData);
      setSuccess(true);
      setTimeout(() => {
        setShowApplicationForm(false);
        setSuccess(false);
        router.push('/');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
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
            Thank you for your interest in partnering with Vibe With KQ. We'll review your application and get back to you within 3-5 business days.
          </p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-medium tracking-wider uppercase text-sm">Global Network</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Business Communities
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Join our network of verified local businesses across the globe and connect with thousands of Kenya Airways travelers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 font-bold rounded-full hover:from-yellow-400 hover:to-yellow-300 transition-all flex items-center justify-center gap-2"
            >
              Become a Partner
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#cities"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
            >
              Explore Cities
            </a>
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
                Connect with thousands of Kenya Airways passengers looking for trusted local services at their destinations.
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

            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Verified Badge</h3>
              <p className="text-gray-600 leading-relaxed">
                Get a verified badge that builds trust with travelers and boosts your credibility in the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Communities Grid */}
      <section id="cities" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-600 font-semibold tracking-wider uppercase text-sm">Our Presence</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">Partner Cities</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore our verified business partners in cities around the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {allCities.map((cityKey) => {
              const city = businessCommunities[cityKey];
              return (
                <button
                  key={cityKey}
                  onClick={() => setSelectedCity(cityKey)}
                  className={`group relative h-72 rounded-2xl overflow-hidden text-left ${
                    selectedCity === cityKey ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-3xl mb-2 block">{city.flag}</span>
                    <h3 className="text-2xl font-bold text-white">{city.name}</h3>
                    <p className="text-gray-300 text-sm">{city.country}</p>
                    <div className="mt-3 flex items-center text-yellow-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View Partners <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                  {selectedCity === cityKey && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected City Details */}
          {cityData && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={cityData.image}
                  alt={cityData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-4xl mb-2 block">{cityData.flag}</span>
                  <h3 className="text-4xl font-bold text-white mb-2">{cityData.name}, {cityData.country}</h3>
                  <p className="text-white/90 text-lg max-w-2xl">{cityData.description}</p>
                </div>
              </div>

              <div className="p-8">
                {/* Highlights */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Popular Experiences</h4>
                  <div className="flex flex-wrap gap-3">
                    {cityData.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Partners Grid */}
                <h4 className="text-lg font-bold text-gray-900 mb-6">Verified Partners</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cityData.partners.map((partner) => (
                    <div
                      key={partner.name}
                      className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="h-32 overflow-hidden">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                          {partner.category}
                        </span>
                        <h5 className="font-bold text-gray-900 mt-1 mb-2">{partner.name}</h5>
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">{partner.rating}</span>
                          <span className="text-green-600 ml-2 text-xs flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setFormData({ ...formData, city: cityData.name });
                      setShowApplicationForm(true);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-full hover:from-red-500 hover:to-red-400 transition-all"
                  >
                    Become a Partner in {cityData.name}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-8 h-8 text-red-600" />
                  <h2 className="text-2xl font-bold">Partnership Application</h2>
                </div>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option value="">Select city</option>
                      <option value="Bangkok">Bangkok, Thailand</option>
                      <option value="Sydney">Sydney, Australia</option>
                      <option value="Rome">Rome, Italy</option>
                      <option value="Nairobi">Nairobi, Kenya</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Category *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      value={formData.business_category}
                      onChange={(e) => setFormData({ ...formData, business_category: e.target.value })}
                    >
                      <option value="">Select category</option>
                      <option value="activities">Activities & Experiences</option>
                      <option value="adventure">Adventure & Tours</option>
                      <option value="hotel">Hotel, Motel & Lodging</option>
                      <option value="transport">Transport & Transfers</option>
                      <option value="merchandise">Merchandise & Shopping</option>
                      <option value="restaurant">Restaurant & Dining</option>
                      <option value="wellness">Wellness & Spa</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      value={formData.business_registration_number}
                      onChange={(e) => setFormData({ ...formData, business_registration_number: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    value={formData.business_address}
                    onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      value={formData.business_phone}
                      onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      value={formData.business_email}
                      onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Website
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    value={formData.business_website}
                    onChange={(e) => setFormData({ ...formData, business_website: e.target.value })}
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    value={formData.business_description}
                    onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                    placeholder="Tell us about your business and services..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-500 hover:to-red-400 transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this application, you agree to our partner terms and conditions.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function BusinessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function Business() {
  return (
    <Suspense fallback={<BusinessLoading />}>
      <BusinessContent />
    </Suspense>
  );
}

