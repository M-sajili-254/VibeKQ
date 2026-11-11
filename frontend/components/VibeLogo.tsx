import Link from 'next/link';

export default function VibeLogo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">L</span>
      </div>

      <span className="text-3xl font-bold italic text-primary" style={{ fontFamily: 'Selima' }}>
        LinkedSky
      </span>
    </Link>
  );
}
