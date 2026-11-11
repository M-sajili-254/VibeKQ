import Link from 'next/link';
import { ArrowRight, Plane, Store, Camera, Globe } from 'lucide-react';
import DestinationMarketplace from '@/components/DestinationMarketplace';

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-brand-950 px-4 py-20 text-white sm:px-6 lg:py-28">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-white/10" />
        <div className="absolute -right-20 -top-20 h-[440px] w-[440px] rounded-full border border-white/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/30 bg-brand-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-200"><Plane className="h-4 w-4" /> Kigali first. Connected beyond.</span>
            <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Your flight is just<br />the <span className="text-amber-300">beginning.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-50/75">Meet the people, places and businesses that make a destination worth discovering. From airport arrivals to local dining, shops and unforgettable experiences.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#marketplace" className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-bold text-slate-950 hover:bg-amber-200">Explore destinations <ArrowRight className="h-5 w-5" /></Link>
              <Link href="/business/apply" className="rounded-full border border-white/25 px-7 py-4 font-semibold hover:bg-white/10">Bring your business on board</Link>
            </div>
            <p className="mt-8 text-xs text-brand-100/60">Kigali · Nairobi · New York · Bangkok · and more pilot destinations</p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Kigali launch focus</p>
            <h2 className="mt-4 text-3xl font-bold">A local welcome.<br />An airline-sized opportunity.</h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-50/70">A partnership proposal for RwandAir and Kigali's business communities: connect the passenger journey to the local economy, before and after arrival.</p>
            <div className="mt-7 space-y-5">
              {[
                { icon: Plane, title: 'Airport to city', description: 'Connect arrival essentials with destination discovery.' },
                { icon: Camera, title: 'Real businesses, real visibility', description: 'Merchant-submitted photos, reviewed before publication.' },
                { icon: Globe, title: 'One platform, many destinations', description: 'Local communities with a consistent traveler experience.' },
              ].map(({ icon: FeatureIcon, title, description }) => {
                return <div key={title} className="flex gap-3"><FeatureIcon className="mt-1 h-5 w-5 shrink-0 text-amber-300" /><div><p className="font-semibold">{title}</p><p className="mt-1 text-xs leading-relaxed text-brand-100/60">{description}</p></div></div>;
              })}
            </div>
            <p className="mt-7 border-t border-white/10 pt-4 text-xs text-brand-100/50">Independent platform proposal. No airline endorsement or partnership is claimed. Kigali merchant onboarding is open.</p>
          </div>
        </div>
      </section>

      <DestinationMarketplace compact />

      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-3xl bg-brand-50 p-8 md:grid-cols-[1.5fr,1fr] md:p-12">
          <div><Store className="mb-4 h-8 w-8 text-primary" /><h2 className="text-3xl font-black text-slate-950">Your business belongs in the journey.</h2><p className="mt-4 max-w-xl text-slate-600">Restaurants, shops, hotels, tour guides and transfer operators: create a profile, upload your real photos and submit your business for review. Airport and city communities are both welcome.</p></div>
          <div className="flex flex-col items-start gap-4"><Link href="/business/apply" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-white hover:bg-brand-900">Start merchant onboarding <ArrowRight className="h-5 w-5" /></Link><Link href="/partner-login" className="text-sm font-semibold text-primary underline">Already a partner? Sign in</Link><p className="text-xs text-slate-500">Profiles and photos become visible after approval.</p></div>
        </div>
      </section>
    </div>
  );
}
