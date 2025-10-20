'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plane, MapPin, Users, ShoppingBag, Calendar, Star } from 'lucide-react';
import { destinationService, communityService } from '@/utils/api';

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
        setDestinations(destData.results?.slice(0, 3) || []);
        setEvents(eventData.results?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero z-0"></div>
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Vibe With KQ
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            More than just a flight. Connect travel with culture, passion, and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trip-assistant"
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Plan Your Trip
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Experience the Vibe
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trip Assistant</h3>
              <p className="text-gray-600">
                Book verified local services - hotels, taxis, tours - seamlessly tied to your destination.
              </p>
              <Link href="/trip-assistant" className="text-primary font-semibold mt-4 inline-block hover:underline">
                Explore Services →
              </Link>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vibe Community</h3>
              <p className="text-gray-600">
                Connect with KQ staff, share stories, and engage with passion projects and CSR initiatives.
              </p>
              <Link href="/community" className="text-primary font-semibold mt-4 inline-block hover:underline">
                Join Community →
              </Link>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Business Partners</h3>
              <p className="text-gray-600">
                Verified local businesses offering trusted services to enhance your travel experience.
              </p>
              <Link href="/business" className="text-primary font-semibold mt-4 inline-block hover:underline">
                Become a Partner →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Destinations</h2>
            <Link href="/trip-assistant" className="text-primary font-semibold hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {destinations.map((dest: any) => (
                <Link key={dest.id} href={`/trip-assistant/destinations/${dest.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group">
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-yellow-400 relative overflow-hidden">
                      {dest.image && (
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{dest.city}, {dest.country}</h3>
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Upcoming Events</h2>
            <Link href="/community/events" className="text-primary font-semibold hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event: any) => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-warm text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience Modern African Luxury?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of travelers who trust Vibe With KQ for authentic, curated experiences.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
