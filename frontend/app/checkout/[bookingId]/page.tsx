'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, Smartphone, CheckCircle, AlertCircle, ArrowLeft, Loader } from 'lucide-react';
import api from '@/utils/api';

export default function Checkout() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/trip-assistant/bookings/${bookingId}/`);
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleMpesaPayment = async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await api.post('/trip-assistant/payments/initiate/', {
        booking_id: bookingId, // Use UUID string directly
        payment_method: 'mpesa',
        mpesa_phone_number: mpesaPhone,
      });

      if (response.data.success) {
        setPaymentId(response.data.payment_id);
        // Poll for payment confirmation
        pollPaymentStatus(response.data.payment_id);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await api.post('/trip-assistant/payments/initiate/', {
        booking_id: bookingId, // Use UUID string directly
        payment_method: 'card',
      });

      if (response.data.success) {
        setPaymentId(response.data.payment_id);
        // In production, integrate Stripe Elements here
        // For now, simulate card payment
        setTimeout(() => {
          confirmPayment(response.data.payment_id);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  const pollPaymentStatus = async (paymentId: number) => {
    let attempts = 0;
    const maxAttempts = 20; // Poll for 1 minute (3s * 20)

    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await api.post(`/trip-assistant/payments/${paymentId}/confirm/`);
        
        if (response.data.success) {
          clearInterval(poll);
          setSuccess(true);
          setProcessing(false);
          
          setTimeout(() => {
            router.push('/trip-assistant');
          }, 3000);
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          setError('Payment confirmation timeout. Please check your M-Pesa messages.');
          setProcessing(false);
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setError('Payment confirmation failed');
          setProcessing(false);
        }
      }
    }, 3000);
  };

  const confirmPayment = async (paymentId: number) => {
    try {
      const response = await api.post(`/trip-assistant/payments/${paymentId}/confirm/`);
      
      if (response.data.success) {
        setSuccess(true);
        setProcessing(false);
        
        setTimeout(() => {
          router.push('/trip-assistant');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment confirmation failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Booking Not Found</h2>
          <button
            onClick={() => router.push('/trip-assistant')}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. You'll receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500">Redirecting to services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-8">Complete Your Payment</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Service</p>
                  <p className="font-semibold">{booking.service_name}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold">{new Date(booking.booking_date).toLocaleDateString()}</p>
                </div>
                
                {booking.booking_time && (
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-semibold">{booking.booking_time}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-600">Number of People</p>
                  <p className="font-semibold">{booking.number_of_people}</p>
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-red-700">${parseFloat(booking.total_price).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {!paymentMethod ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* M-Pesa Option */}
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className="group border-2 border-gray-200 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition text-left"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                      <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">M-Pesa</h3>
                    <p className="text-sm text-gray-600">Pay with your M-Pesa mobile money</p>
                  </button>

                  {/* Card Option */}
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className="group border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition text-left"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Debit/Credit Card</h3>
                    <p className="text-sm text-gray-600">Pay securely with your card</p>
                  </button>
                </div>
              ) : paymentMethod === 'mpesa' ? (
                <div>
                  <button
                    onClick={() => setPaymentMethod(null)}
                    className="text-sm text-gray-600 hover:text-gray-900 mb-4"
                  >
                    ← Change payment method
                  </button>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="254XXXXXXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        disabled={processing}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your M-Pesa registered phone number
                      </p>
                    </div>

                    <button
                      onClick={handleMpesaPayment}
                      disabled={processing || !mpesaPhone}
                      className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {processing ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Processing... Check your phone</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-5 h-5" />
                          <span>Pay with M-Pesa</span>
                        </>
                      )}
                    </button>

                    {processing && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                        <p className="font-semibold mb-1">STK Push Sent!</p>
                        <p>Please check your phone and enter your M-Pesa PIN to complete the payment.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setPaymentMethod(null)}
                    className="text-sm text-gray-600 hover:text-gray-900 mb-4"
                  >
                    ← Change payment method
                  </button>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Demo Mode:</strong> Card payment integration with Stripe. In production, this would show Stripe Elements for secure card input.
                      </p>
                    </div>

                    <button
                      onClick={handleCardPayment}
                      disabled={processing}
                      className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {processing ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Pay with Card</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
