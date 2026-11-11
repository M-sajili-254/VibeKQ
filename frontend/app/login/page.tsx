'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, Briefcase, User, ArrowRight } from 'lucide-react';
import VibeLogo from '@/components/VibeLogo';

export default function LoginSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <VibeLogo />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
            Welcome to LinkedSky
          </h1>
          <p className="text-gray-600 text-lg">
            Choose how you'd like to sign in
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Login */}
          <button
            onClick={() => router.push('/ticket-login')}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 text-left border-2 border-transparent hover:border-brand-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              I'm a Customer
            </h2>
            <p className="text-gray-600 mb-4">
              Login with your airline ticket to access exclusive local services and experiences
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-primary font-semibold">
              <User className="w-4 h-4" />
              <span>Login with Ticket Number</span>
            </div>
          </button>

          {/* Partner Login */}
          <button
            onClick={() => router.push('/partner-login')}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 text-left border-2 border-transparent hover:border-brand-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              I'm a Partner
            </h2>
            <p className="text-gray-600 mb-4">
              Business partners and staff members login with username and password
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-primary font-semibold">
              <Briefcase className="w-4 h-4" />
              <span>Login with Credentials</span>
            </div>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            New business partner?{' '}
            <Link href="/business/apply" className="text-primary hover:text-primary font-semibold hover:underline">
              Apply for a business account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
