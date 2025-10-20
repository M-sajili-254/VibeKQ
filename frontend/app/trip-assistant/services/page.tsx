'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react';
import { serviceService } from '@/utils/api';

export default function Services() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const destinationId = searchParams.get('destination');
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const params: any = {};
        if (categoryId) params.category = categoryId;
        if (destinationId) params.destination = destinationId;
        
        const data = await serviceService.getAll(params);
        setServices(data.results || data || []);
        
        // Get category name from first service
        if (data.results && data.results.length > 0) {
          setCategoryName(data.results[0].category_name);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId, destinationId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/trip-assistant" 
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Trip Assistant</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {categoryName || 'Services'}
          </h1>
          <p className="text-xl text-red-100">
            Browse and book amazing services for your journey
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
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
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Services Found</h2>
              <p className="text-gray-500 mb-6">
                We couldn't find any services matching your criteria.
              </p>
              <Link
                href="/trip-assistant"
                className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Browse All Categories
              </Link>
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
                        src={service.image}
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

                    {/* Provider */}
                    <p className="text-xs text-gray-500 mb-4">
                      by {service.provider_name}
                    </p>

                    {/* Price and CTA */}
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
    </div>
  );
}
