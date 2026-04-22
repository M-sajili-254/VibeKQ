'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Users, Calendar, Star, Globe, Sparkles, ArrowRight, Building2 } from 'lucide-react';
import { destinationService, communityService, getImageUrl } from '@/utils/api';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destData, eventData] = await Promise.all([
          destinationService.getAll(),
          communityService.getEvents(),
        ]);
        setDestinations(destData.results?.slice(0, 6) || []);
        setEvents(eventData.results?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Featured cities for Business Communities
  const businessCities = [
    { name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600' },
    { name: 'Sydney', country: 'Australia', flag: '🇦🇺', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600' },
    { name: 'Rome', country: 'Italy', flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
    { name: 'Nairobi', country: 'Kenya', flag: '🇰🇪', image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=600' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Unique Animated Gradient Design */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-medium tracking-wider uppercase text-sm">Experience Africa's Pride</span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
              Vibe With KQ
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-4 text-gray-300 max-w-2xl mx-auto">
            More than just a flight. Your gateway to
          </p>
          <p className="text-2xl md:text-3xl font-semibold mb-10 text-white">
            Culture • Connection • Community
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trip-assistant"
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-full hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
            >
              Plan Your Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
            >
              Join the Community
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">50+</p>
              <p className="text-sm text-gray-400">Destinations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">200+</p>
              <p className="text-sm text-gray-400">Partners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">10K+</p>
              <p className="text-sm text-gray-400">Happy Travelers</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Card-based Design */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-600 font-semibold tracking-wider uppercase text-sm">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
              Experience the Vibe
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Trip Assistant</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Book verified local services - hotels, transport, adventure tours - seamlessly tied to your destination.
              </p>
              <Link href="/trip-assistant" className="inline-flex items-center text-red-600 font-semibold hover:gap-3 gap-2 transition-all">
                Explore Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Community Vibes</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Connect with KQ staff, share stories, and engage with passion projects and CSR initiatives.
              </p>
              <Link href="/community" className="inline-flex items-center text-orange-600 font-semibold hover:gap-3 gap-2 transition-all">
                Join Community <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-100">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/20">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Business Partners</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Verified local businesses offering trusted services to enhance your travel experience.
              </p>
              <Link href="/business" className="inline-flex items-center text-yellow-600 font-semibold hover:gap-3 gap-2 transition-all">
                Become a Partner <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Communities Section - New */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-semibold tracking-wider uppercase text-sm">Global Network</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Business Communities
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Discover verified local businesses in our partner cities across the globe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {businessCities.map((city) => (
              <Link
                key={city.name}
                href={`/business?city=${city.name.toLowerCase()}`}
                className="group relative h-72 rounded-2xl overflow-hidden"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-3xl mb-2 block">{city.flag}</span>
                  <h3 className="text-2xl font-bold">{city.name}</h3>
                  <p className="text-gray-300 text-sm">{city.country}</p>
                  <div className="mt-3 flex items-center text-yellow-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Partners <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/business"
              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 text-slate-900 font-bold rounded-full hover:bg-yellow-400 transition-all"
            >
              View All Cities
              <Globe className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <span className="text-red-600 font-semibold tracking-wider uppercase text-sm">Where To Go</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">Featured Destinations</h2>
            </div>
            <Link href="/trip-assistant" className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest: any) => (
                <Link key={dest.id} href={`/trip-assistant?destination=${dest.id}`}>
                  <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="h-56 bg-gradient-to-br from-red-100 to-orange-100 relative overflow-hidden">
                      {dest.image ? (
                        <img
                          src={getImageUrl(dest.image) || ''}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <MapPin className="w-16 h-16 text-red-300" />
                        </div>
                      )}
                      {dest.featured && (
                        <span className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{dest.country}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{dest.city}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{dest.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm">Join Us</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">Upcoming Events</h2>
            </div>
            <Link href="/community" className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all">
              View All Events <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {events.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              events.map((event: any) => (
                <div key={event.id} className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-orange-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white shadow-lg">
                      <span className="text-xl font-bold leading-none">
                        {new Date(event.start_date).getDate()}
                      </span>
                      <span className="text-xs uppercase">
                        {new Date(event.start_date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                      <span className="text-xs text-orange-600 font-medium">{event.event_type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Experience Modern African Luxury?
          </h2>
          <p className="text-xl mb-10 text-white/90">
            Join thousands of travelers who trust Vibe With KQ for authentic, curated experiences.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg shadow-black/20 text-lg"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
