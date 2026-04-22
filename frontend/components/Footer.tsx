import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Plane, Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black">Vibe With KQ</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connecting travel with culture, passion, and community. Experience the pride of Africa with Kenya Airways.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/trip-assistant" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Trip Assistant
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Community Vibes
                </Link>
              </li>
              <li>
                <Link href="/community/merchandise" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Merchandise
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Business Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Communities */}
          <div>
            <h4 className="font-bold text-lg mb-6">Business Communities</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/business?city=bangkok" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span>🇹🇭</span>
                  Bangkok, Thailand
                </Link>
              </li>
              <li>
                <Link href="/business?city=sydney" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span>🇦🇺</span>
                  Sydney, Australia
                </Link>
              </li>
              <li>
                <Link href="/business?city=rome" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span>🇮🇹</span>
                  Rome, Italy
                </Link>
              </li>
              <li>
                <Link href="/business?city=nairobi" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <span>🇰🇪</span>
                  Nairobi, Kenya
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Email Us</p>
                  <a href="mailto:vibe@kenya-airways.com" className="text-gray-400 hover:text-white transition">
                    vibe@kenya-airways.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Call Us</p>
                  <a href="tel:+254711024747" className="text-gray-400 hover:text-white transition">
                    +254 711 024 747
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Kenya Airways</p>
                  <a href="https://www.kenya-airways.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    www.kenya-airways.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Vibe With KQ. A Kenya Airways Experience.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition">
                Terms of Service
              </Link>
              <Link href="/help" className="text-gray-400 hover:text-white transition">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
