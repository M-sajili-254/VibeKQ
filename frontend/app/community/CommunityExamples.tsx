import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import PhotoGallery from '@/components/PhotoGallery';

type ExampleKind = 'posts' | 'events' | 'memories' | 'merchandise';

interface Example {
  title: string;
  description: string;
  location: string;
  image: string;
}

const coffee = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop';
const art = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop';
const meeting = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop';
const nature = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop';
const lake = 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop';
const fashion = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop';

const examples: Record<ExampleKind, Example[]> = {
  posts: [
    { title: 'From bean to cup: discovering Rwandan coffee', description: 'Sample community story: meet coffee growers, learn about roasting and explore how local cafes can share their craft with visitors.', location: 'Rwanda coffee communities', image: coffee },
    { title: 'The stories behind Imigongo and Agaseke', description: 'Sample culture post: celebrate the patterns, skills and traditions behind Imigongo art and Agaseke baskets, with space for artisans to tell their own stories.', location: 'Rwanda artisan communities', image: art },
    { title: 'A local business welcome to Kigali', description: 'Sample announcement: invite shops, guides, restaurants and service providers to submit their profiles and real business photos for review.', location: 'Kigali', image: meeting },
  ],
  events: [
    { title: 'Kigali Entrepreneurs & Business Meetup', description: 'Sample event concept for founder introductions, SME networking and service showcases. Date, organizer and venue are not confirmed.', location: 'Kigali · venue to be confirmed', image: meeting },
    { title: 'Rwanda Coffee Tasting & Craft Afternoon', description: 'Sample workshop concept combining coffee tasting with an introduction to local crafts. No scheduled session, vendor or ticket is confirmed.', location: 'Kigali · venue to be confirmed', image: coffee },
    { title: 'Formula 1 Grand Prix Fan Screening', description: 'Sample fan-viewing concept for watching an international race and meeting motorsport enthusiasts. Not a Rwanda-hosted Grand Prix. Date, screening rights and venue require confirmation.', location: 'Kigali · venue to be confirmed', image: meeting },
  ],
  memories: [
    { title: 'A quiet afternoon by Lake Kivu', description: 'Illustrative memory concept: a lakeside weekend, local conversations and time to unwind. This is not a submitted traveler photograph or testimony.', location: 'Lake Kivu, Rwanda', image: lake },
    { title: 'Green trails and fresh air in Nyungwe', description: 'Illustrative memory concept: forest walks and nature discovery. The stock photo is not a verified image of Nyungwe or an actual community visit.', location: 'Nyungwe, Rwanda', image: nature },
    { title: 'Coffee conversations in Kigali', description: 'Illustrative memory concept: discovering a neighborhood cafe and learning about Rwandan coffee. No actual cafe or traveler experience is represented.', location: 'Kigali, Rwanda', image: coffee },
  ],
  merchandise: [
    { title: 'Rwandan Coffee Gift Collection', description: 'Sample product concept: a gift selection of locally roasted coffee with brewing notes. Supplier, packaging, price and availability are not confirmed.', location: 'Rwanda', image: coffee },
    { title: 'Agaseke & Imigongo Artisan Gifts', description: 'Sample product concept: woven baskets and decorative art celebrating Rwandan craft traditions. Actual artisan products and licensed photos must be supplied by merchants.', location: 'Rwanda', image: art },
    { title: 'Kigali Travel & Fashion Edit', description: 'Sample product concept: locally inspired clothing, tote bags and travel accessories. Designs, producer, price and stock are not confirmed.', location: 'Kigali', image: fashion },
  ],
};

const headings: Record<ExampleKind, string> = {
  posts: 'Rwanda community story examples',
  events: 'Rwanda event concepts',
  memories: 'Rwanda memory inspiration',
  merchandise: 'Rwanda product showcase examples',
};

export default function CommunityExamples({ kind }: { kind: ExampleKind }) {
  return (
    <section aria-labelledby={`${kind}-examples-heading`} className="mt-10 border-t border-gray-200 pt-8">
      <h2 id={`${kind}-examples-heading`} className="text-2xl font-bold text-gray-900">{headings[kind]}</h2>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-gray-600">
        Demonstration content, separate from the community catalogue. All photos are illustrative stock imagery, not verified Rwanda locations, merchant products or community submissions.
        {kind === 'events' && ' These are unscheduled ideas, not events open for registration.'}
        {kind === 'merchandise' && ' These examples are not for sale and cannot be added to the cart.'}
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples[kind].map((example) => (
          <article key={example.title} className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg">
            <PhotoGallery images={[example.image]} name={example.title} label="Illustrative photo" className="h-48" />
            <div className="p-6">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Demonstration {kind === 'events' ? '· not scheduled' : kind === 'merchandise' ? '· not for sale' : 'example'}</span>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">{example.title}</h3>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3 w-3 shrink-0" />{example.location}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{example.description}</p>
            </div>
          </article>
        ))}
      </div>
      {(kind === 'events' || kind === 'merchandise') && (
        <Link href="/business/apply" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          {kind === 'events' ? 'Offer event services? List your business' : 'Showcase your real products through a business profile'}
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      )}
    </section>
  );
}
