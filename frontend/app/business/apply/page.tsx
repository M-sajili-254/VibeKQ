'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Briefcase, Building2, CheckCircle, Lock, MapPin, User } from 'lucide-react';
import VibeLogo from '@/components/VibeLogo';
import { authService, destinationService } from '@/utils/api';

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

export default function BusinessApplyPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    business_name: '',
    business_category: '',
    community_type: 'destination',
    destination: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll();
        setDestinations(data.results || data || []);
      } catch (fetchError) {
        console.error('Error fetching destinations:', fetchError);
      }
    };

    fetchDestinations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signup({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        password2: formData.password2,
        user_type: 'business_partner',
        business_name: formData.business_name,
        business_category: formData.business_category,
      });

      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
      window.dispatchEvent(new Event('auth-changed'));

      const params = new URLSearchParams({ portal: 'partner' });
      if (formData.community_type) {
        params.set('community', formData.community_type);
      }
      if (formData.destination) {
        params.set('destination', formData.destination);
      }

      router.push(`/business?${params.toString()}`);
    } catch (submitError: any) {
      setError(getErrorMessage(submitError, 'Business account creation failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr,1.1fr] gap-10 items-start">
        <div>
          <div className="mb-8">
            <VibeLogo />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-300 mb-4">
            Partner onboarding
          </p>
          <h1 className="text-5xl font-black leading-tight mb-6">
            Become a Business Partner
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Create your business account first. After sign-in, you will land in the business portal to upload company details, documents, and destination data.
          </p>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <p>Choose whether you operate as an <strong>Airport Business</strong> or <strong>Destination Business</strong>.</p>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <p>Select the destination you want to serve so the portal can prefill your workspace.</p>
            </div>
            <div className="flex gap-3">
              <Briefcase className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <p>Already registered? Use partner sign-in instead of creating a new account.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/partner-login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-slate-950 font-bold hover:bg-yellow-300 transition"
            >
              Existing partner sign in
              <Lock className="w-4 h-4" />
            </Link>
            <Link
              href="/ticket-login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 font-semibold hover:bg-white/20 transition"
            >
              Customer ticket login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white text-gray-900 rounded-[2rem] shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black">Apply for a Business Account</h2>
            <p className="text-gray-600 mt-2">Create your partner credentials, then continue inside the business workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First name</label>
                <input
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last name</label>
                <input
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 pl-11 pr-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 pl-11 pr-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business category</label>
                <input
                  required
                  value={formData.business_category}
                  onChange={(e) => setFormData({ ...formData, business_category: e.target.value })}
                  placeholder="Hotel, lounge, retail, tours..."
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone number</label>
                <input
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business type</label>
                <select
                  value={formData.community_type}
                  onChange={(e) => setFormData({ ...formData, community_type: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                >
                  <option value="airport">Airport Business</option>
                  <option value="destination">Destination Business</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred destination</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm password</label>
                <input
                  required
                  type="password"
                  value={formData.password2}
                  onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-white font-bold hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? 'Creating business account...' : 'Create business account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
