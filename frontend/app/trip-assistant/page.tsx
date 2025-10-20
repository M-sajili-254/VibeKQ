'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter } from 'lucide-react';
import { destinationService, serviceService } from '@/utils/api';

export default function TripAssistant() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destData, catData] = await Promise.all([
          destinationService.getAll(),
          serviceService.getCategories(),
        ]);
        setDestinations(destData.results || destData || []);
        setCategories(catData.results || catData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDestinations = destinations.filter((dest: any) =>
    dest.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Your Personal Trip Assistant</h1>
          <p className="text-xl mb-8">
            Book verified local services seamlessly tied to your destination
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg p-2 flex items-center max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search destinations..."
              className="flex-1 px-4 py-3 text-gray-900 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/trip-assistant/services?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <div className="text-4xl mb-2">{category.icon || '📍'}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Popular Destinations</h2>

          {loading ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDestinations.map((dest: any) => (
                <Link
                  key={dest.id}
                  href={`/trip-assistant/destinations/${dest.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition group"
                >
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-yellow-400 relative overflow-hidden">
                    {dest.image && (
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    )}
                    {dest.featured && (
                      <span className="absolute top-2 right-2 bg-white text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{dest.country}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{dest.city}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{dest.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No destinations found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Destination</h3>
              <p className="text-gray-600">
                Browse our curated list of destinations and select where you're heading.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Verified Services</h3>
              <p className="text-gray-600">
                Select from verified hotels, taxis, tours, and more from trusted local partners.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Enjoy Your Journey</h3>
              <p className="text-gray-600">
                Travel with confidence knowing your services are pre-arranged and verified.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
