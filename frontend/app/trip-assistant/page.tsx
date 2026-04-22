'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, DollarSign, CheckCircle, Lock } from 'lucide-react';
import { destinationService, serviceService, getImageUrl } from '@/utils/api';

export default function TripAssistant() {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

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

  useEffect(() => {
    const fetchServices = async () => {
      if (selectedCategory || selectedDestination) {
        setServicesLoading(true);
        try {
          const params: any = {};
          if (selectedCategory) params.category = selectedCategory;
          if (selectedDestination) params.destination = selectedDestination;
          
          const data = await serviceService.getAll(params);
          setServices(data.results || data || []);
        } catch (error) {
          console.error('Error fetching services:', error);
        } finally {
          setServicesLoading(false);
        }
      } else {
        setServices([]);
      }
    };

    fetchServices();
  }, [selectedCategory, selectedDestination]);

  const filteredDestinations = destinations.filter((dest: any) =>
    dest.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // Scroll to services section after a short delay to allow state update
    setTimeout(() => {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDestinationClick = (destinationId: number) => {
    setSelectedDestination(destinationId);
    // Scroll to services section
    setTimeout(() => {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDestination(null);
    setServices([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20 px-4">
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
          <h2 className="text-3xl font-bold mb-8">Business Vibes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center ${
                  selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="text-4xl mb-2">{category.icon || '📍'}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Display */}
      {(selectedCategory || selectedDestination) && (
        <section id="services-section" className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Available Services</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                      {(categories.find((c: any) => c.id === selectedCategory) as any)?.name || 'Category'}
                    </span>
                  )}
                  {selectedDestination && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {(destinations.find((d: any) => d.id === selectedDestination) as any)?.city || 'Destination'}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition whitespace-nowrap"
              >
                Clear Filters
              </button>
            </div>

            {servicesLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Services Found</h3>
                <p className="text-gray-500">
                  We couldn't find any services matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow hover:shadow-xl transition group overflow-hidden"
                  >
                    {/* Service Image */}
                    <div className="relative h-48 bg-gradient-to-br from-red-100 to-red-50 overflow-hidden">
                      {service.image ? (
                        <img
                          src={getImageUrl(service.image) || ''}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <MapPin className="w-16 h-16 text-red-300" />
                        </div>
                      )}
                      
                      {/* Verified Badge */}
                      {service.verified && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}

                      {/* Rating */}
                      {service.rating > 0 && (
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-sm">{service.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                        {service.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{service.destination_name}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Provider - Hidden if not authenticated */}
                      {isAuthenticated ? (
                        <p className="text-xs text-gray-500 mb-4">
                          by {service.provider_name}
                        </p>
                      ) : (
                        <div className="flex items-center text-xs text-gray-400 mb-4">
                          <Lock className="w-3 h-3 mr-1" />
                          <span>Login to see provider details</span>
                        </div>
                      )}

                      {/* Price and CTA */}
                      {isAuthenticated ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Starting from</p>
                            <p className="text-2xl font-bold text-red-700 flex items-center">
                              <DollarSign className="w-5 h-5" />
                              {parseFloat(service.price).toFixed(0)}
                              <span className="text-sm text-gray-500 ml-1">{service.currency}</span>
                            </p>
                          </div>
                          <Link
                            href={`/trip-assistant/services/${service.id}`}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                          >
                            View Details
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={() => router.push('/ticket-login')}
                          className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition flex items-center justify-center space-x-2"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Login with Ticket to View Details</span>
                        </button>
                      )}

                      {/* Booking Count */}
                      {service.total_bookings > 0 && (
                        <p className="text-xs text-gray-500 mt-3">
                          {service.total_bookings} bookings
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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
                <button
                  key={dest.id}
                  onClick={() => handleDestinationClick(dest.id)}
                  className={`bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition group text-left ${
                    selectedDestination === dest.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-yellow-400 relative overflow-hidden">
                    {dest.image && (
                      <img
                        src={getImageUrl(dest.image) || ''}
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
                </button>
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
                Select from verified hotels, transport, adventure tours, and more from trusted local partners.
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
