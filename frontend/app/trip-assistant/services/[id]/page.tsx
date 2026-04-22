'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, DollarSign, CheckCircle, ArrowLeft, Calendar, Users } from 'lucide-react';
import { serviceService, bookingService, getImageUrl, getItemImage } from '@/utils/api';

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    booking_date: '',
    booking_time: '10:00',
    number_of_people: 1,
    special_requests: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Don't parse as int - IDs are UUIDs
        const data = await serviceService.getById(serviceId);
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const booking = await bookingService.create({
        service: serviceId, // Use UUID string directly
        ...bookingData,
      });
      // Redirect to checkout page with booking ID
      router.push(`/checkout/${booking.id}`);
    } catch (error: any) {
      setBookingError(error.response?.data?.error || 'Booking failed. Please try again.');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Service Not Found</h2>
          <Link
            href="/trip-assistant"
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Back to Trip Assistant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/trip-assistant" 
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Trip Assistant</span>
          </Link>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Image */}
              <div className="relative h-96 bg-gradient-to-br from-red-100 to-red-50 rounded-lg overflow-hidden mb-6">
                {getItemImage(service) ? (
                  <img
                    src={getItemImage(service) || ''}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <MapPin className="w-32 h-32 text-red-300" />
                  </div>
                )}
                
                {service.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Verified Provider</span>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{service.destination_name}</span>
                    </div>
                    <p className="text-gray-600">by {service.provider_name}</p>
                  </div>
                  {service.rating > 0 && (
                    <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      <span className="text-2xl font-bold">{service.rating}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
                </div>

                {service.total_bookings > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-600">
                      <span className="font-semibold">{service.total_bookings}</span> people have booked this service
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              {service.reviews && service.reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {service.reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{review.user_name}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-1">Price per person</p>
                  <p className="text-4xl font-bold text-red-700 flex items-center">
                    <DollarSign className="w-8 h-8" />
                    {parseFloat(service.price).toFixed(0)}
                    <span className="text-lg text-gray-500 ml-2">{service.currency}</span>
                  </p>
                </div>

                {bookingSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    <p className="font-semibold">Booking Successful!</p>
                    <p className="text-sm">Redirecting...</p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    {bookingError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {bookingError}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date</span>
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                        value={bookingData.booking_date}
                        onChange={(e) => setBookingData({ ...bookingData, booking_date: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                        value={bookingData.booking_time}
                        onChange={(e) => setBookingData({ ...bookingData, booking_time: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Number of People</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                        value={bookingData.number_of_people}
                        onChange={(e) => setBookingData({ ...bookingData, number_of_people: parseInt(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                        value={bookingData.special_requests}
                        onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                        placeholder="Any special requirements?"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Total</span>
                        <span className="text-2xl font-bold text-red-700">
                          ${(parseFloat(service.price) * bookingData.number_of_people).toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {bookingLoading ? 'Booking...' : 'Book Now'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
