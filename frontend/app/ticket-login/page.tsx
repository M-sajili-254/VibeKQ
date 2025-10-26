'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Ticket, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/utils/api';

export default function TicketLogin() {
  const router = useRouter();
  const [ticketNumber, setTicketNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/accounts/verify-ticket/', {
        ticket_number: ticketNumber,
        passport_number: passportNumber || undefined,
      });

      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push('/trip-assistant');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Please check your ticket number.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Ticket Verified!</h1>
          <p className="text-gray-600 mb-6">
            Welcome aboard! Redirecting you to services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Ticket Verification</h1>
          <p className="text-gray-600">
            Login with your airline ticket to access exclusive services
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Number *
              </label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Enter your ticket number"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Found on your e-ticket or boarding pass
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number (Optional)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="For additional verification"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Helps us verify your identity faster
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Ticket & Login'}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Why ticket verification?</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Secure access to verified local services</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Personalized recommendations based on your destination</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Seamless booking experience</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Your account is remembered for future trips</span>
              </li>
            </ul>
          </div>

          {/* Alternative Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Business partner or staff?{' '}
              <a href="/login" className="text-red-600 hover:text-red-700 font-semibold">
                Login here
              </a>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <strong>Demo Mode:</strong> Use any ticket number with 10+ characters to test the system.
            Example: <code className="bg-blue-100 px-2 py-1 rounded">1234567890</code>
          </p>
        </div>
      </div>
    </div>
  );
}
