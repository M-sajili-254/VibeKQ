'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Save,
  Sparkles,
  Ticket,
  User,
  X,
} from 'lucide-react';
import { authService, getImageUrl } from '@/utils/api';

const stringifyList = (value: string[] | null | undefined) => (value || []).join(', ');
const parseList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    date_of_birth: '',
    nationality: '',
    preferred_categories: '',
    interests: '',
    travel_styles: '',
    preferred_airport_services: '',
    preferred_local_experiences: '',
    preferred_transport_modes: '',
    favorite_destinations: '',
    preferred_budget: 'mid_range',
    travel_frequency: 'occasional',
    dietary_preferences: '',
    accessibility_needs: '',
    recommendation_notes: '',
  });

  const hydrateForm = (userData: any) => {
    const profile = userData.passenger_profile || {};
    setFormData({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      phone_number: userData.phone_number || '',
      bio: userData.bio || '',
      date_of_birth: userData.date_of_birth || '',
      nationality: userData.nationality || '',
      preferred_categories: stringifyList(profile.preferred_categories),
      interests: stringifyList(profile.interests),
      travel_styles: stringifyList(profile.travel_styles),
      preferred_airport_services: stringifyList(profile.preferred_airport_services),
      preferred_local_experiences: stringifyList(profile.preferred_local_experiences),
      preferred_transport_modes: stringifyList(profile.preferred_transport_modes),
      favorite_destinations: stringifyList(profile.favorite_destinations),
      preferred_budget: profile.preferred_budget || 'mid_range',
      travel_frequency: profile.travel_frequency || 'occasional',
      dietary_preferences: profile.dietary_preferences || '',
      accessibility_needs: profile.accessibility_needs || '',
      recommendation_notes: profile.recommendation_notes || '',
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!localStorage.getItem('access_token')) {
        router.push('/login');
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        hydrateForm(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updatedUser = await authService.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        bio: formData.bio,
        date_of_birth: formData.date_of_birth || null,
        nationality: formData.nationality,
        passenger_profile: {
          preferred_categories: parseList(formData.preferred_categories),
          interests: parseList(formData.interests),
          travel_styles: parseList(formData.travel_styles),
          preferred_airport_services: parseList(formData.preferred_airport_services),
          preferred_local_experiences: parseList(formData.preferred_local_experiences),
          preferred_transport_modes: parseList(formData.preferred_transport_modes),
          favorite_destinations: parseList(formData.favorite_destinations),
          preferred_budget: formData.preferred_budget,
          travel_frequency: formData.travel_frequency,
          dietary_preferences: formData.dietary_preferences,
          accessibility_needs: formData.accessibility_needs,
          recommendation_notes: formData.recommendation_notes,
        },
      });

      setUser(updatedUser);
      hydrateForm(updatedUser);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const profile = user.passenger_profile || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-100 mb-2">Passenger profile</p>
          <h1 className="text-4xl font-black mb-2">Your destination preferences</h1>
          <p className="text-red-100">Shape the recommendations and marketplace access you receive after every landing.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-red-600 to-orange-500"></div>
          <div className="relative px-6 pb-6">
            <div className="absolute -top-14 left-6 w-28 h-28 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {user.profile_picture ? (
                <img
                  src={getImageUrl(user.profile_picture) || ''}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <div className="pt-4 flex justify-end gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      hydrateForm(user);
                      setEditing(false);
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit profile
                </button>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">@{user.username}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                {user.user_type === 'business_partner' ? 'Business Partner' :
                 user.user_type === 'staff' ? 'Airline Staff' :
                 user.user_type === 'admin' ? 'Administrator' : 'Passenger'}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow p-6 space-y-5">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              Personal details
            </h3>

            {[
              { label: 'First name', key: 'first_name' },
              { label: 'Last name', key: 'last_name' },
              { label: 'Email', key: 'email', type: 'email', icon: Mail },
              { label: 'Phone number', key: 'phone_number' },
              { label: 'Date of birth', key: 'date_of_birth', type: 'date', icon: Calendar },
              { label: 'Nationality', key: 'nationality', icon: MapPin },
            ].map((field: any) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {editing ? (
                  <input
                    type={field.type || 'text'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                    value={(formData as any)[field.key]}
                    onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{(user as any)[field.key] || 'Not provided'}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {editing ? (
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  value={formData.bio}
                  onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
                />
              ) : (
                <p className="text-gray-900">{user.bio || 'No bio yet'}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-6 space-y-5">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-600" />
              Personalization engine
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                {editing ? (
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                    value={formData.preferred_budget}
                    onChange={(event) => setFormData({ ...formData, preferred_budget: event.target.value })}
                  >
                    <option value="budget">Budget</option>
                    <option value="mid_range">Mid-range</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.preferred_budget?.replace('_', ' ') || 'Mid-range'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Travel frequency</label>
                {editing ? (
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                    value={formData.travel_frequency}
                    onChange={(event) => setFormData({ ...formData, travel_frequency: event.target.value })}
                  >
                    <option value="first_time">First-time traveler</option>
                    <option value="occasional">Occasional traveler</option>
                    <option value="frequent">Frequent traveler</option>
                    <option value="road_warrior">Road warrior</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.travel_frequency?.replace('_', ' ') || 'Occasional'}</p>
                )}
              </div>
            </div>

            {[
              ['Preferred categories', 'preferred_categories'],
              ['Interests', 'interests'],
              ['Travel styles', 'travel_styles'],
              ['Airport services you care about', 'preferred_airport_services'],
              ['Local experiences you want', 'preferred_local_experiences'],
              ['Preferred transport modes', 'preferred_transport_modes'],
              ['Favorite destinations', 'favorite_destinations'],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {editing ? (
                  <input
                    type="text"
                    placeholder="Use commas to separate values"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                    value={(formData as any)[key]}
                    onChange={(event) => setFormData({ ...formData, [key]: event.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{stringifyList((profile as any)[key]) || 'Not set'}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dietary preferences</label>
              {editing ? (
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  value={formData.dietary_preferences}
                  onChange={(event) => setFormData({ ...formData, dietary_preferences: event.target.value })}
                />
              ) : (
                <p className="text-gray-900">{profile.dietary_preferences || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility needs</label>
              {editing ? (
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  value={formData.accessibility_needs}
                  onChange={(event) => setFormData({ ...formData, accessibility_needs: event.target.value })}
                />
              ) : (
                <p className="text-gray-900">{profile.accessibility_needs || 'None shared'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation notes</label>
              {editing ? (
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  value={formData.recommendation_notes}
                  onChange={(event) => setFormData({ ...formData, recommendation_notes: event.target.value })}
                />
              ) : (
                <p className="text-gray-900">{profile.recommendation_notes || 'No notes yet'}</p>
              )}
            </div>
          </div>
        </div>

        {user.active_destination && (
          <div className="bg-white rounded-3xl shadow p-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-red-600" />
              Active destination passport
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Destination</p>
                <p className="text-xl font-bold text-gray-900">{user.active_destination.city}</p>
                <p className="text-sm text-gray-600">{user.active_destination.country}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Airport</p>
                <p className="text-xl font-bold text-gray-900">{user.active_destination.airport_code}</p>
                <p className="text-sm text-gray-600">{user.active_destination.airport_name}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Ticket access</p>
                <p className="text-xl font-bold text-gray-900">{user.last_ticket_number || 'No active ticket'}</p>
                <p className="text-sm text-gray-600">Used as your digital marketplace gateway</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
