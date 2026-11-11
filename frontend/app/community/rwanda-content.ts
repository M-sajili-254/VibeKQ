export const discoveryCategories = [
  'Events & entertainment',
  'Heritage & culture',
  'Business & services',
  'Conference & business venues',
  'Tourism & experiences',
  'Shopping & local products',
] as const;

export type DiscoveryCategory = typeof discoveryCategories[number];

interface DiscoveryExample {
  title: string;
  category: DiscoveryCategory;
  location: string;
  description: string;
  offerings: string[];
  image: string;
  featured?: boolean;
}

const photos = {
  networking: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
  music: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop',
  racing: 'https://images.unsplash.com/photo-1532906619279-a4b7267faa66?w=800&auto=format&fit=crop',
  coffee: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop',
  art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
  technology: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop',
  building: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
  farming: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
  transport: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop',
  wellness: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop',
  training: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
  meeting: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop',
  nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop',
  lake: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop',
};

// Editorial examples are deliberately separate from API businesses and scheduled events.
export const rwandaExamples: DiscoveryExample[] = [
  { title: 'Kigali Business Networking', category: 'Events & entertainment', location: 'Kigali', description: 'A sample after-work networking format for founders, SMEs and professional communities.', offerings: ['Business networking', 'Corporate events', 'Founder introductions'], image: photos.networking, featured: true },
  { title: 'Formula 1 Grand Prix Watch Party', category: 'Events & entertainment', location: 'Kigali', description: 'A fan viewing concept with race screenings, discussion and motorsport community meetups. Not a Rwanda-hosted Grand Prix; no date or venue is confirmed.', offerings: ['Formula 1 fan experiences', 'Race viewing', 'Motorsport communities'], image: photos.racing, featured: true },
  { title: 'Rwanda Technology Expo', category: 'Events & entertainment', location: 'Kigali', description: 'An illustrative exhibition format for technology demos, trade-fair booths and company announcements.', offerings: ['Exhibitions', 'Trade fairs', 'Technology demonstrations'], image: photos.technology },
  { title: 'Kigali Music & Cultural Festival', category: 'Events & entertainment', location: 'Kigali', description: 'A sample programme combining live music, entertainment and cultural performances. Organizers must confirm dates and performers.', offerings: ['Music', 'Entertainment', 'Cultural festivals'], image: photos.music },
  { title: 'Rwanda Corporate Conference Forum', category: 'Events & entertainment', location: 'Kigali', description: 'A demonstration conference concept for industry panels, business presentations and corporate networking.', offerings: ['Conferences', 'Corporate events', 'Industry panels'], image: photos.networking },
  { title: 'Kigali Cultural Heritage Tour', category: 'Heritage & culture', location: 'Kigali', description: 'An example itinerary exploring historical attractions, local art and Rwandan heritage with a cultural guide.', offerings: ['Cultural tours', 'Historical attractions', 'Traditional clothing'], image: photos.art, featured: true },
  { title: 'Intore Dance & Traditional Music', category: 'Heritage & culture', location: 'Kigali & Musanze', description: 'Discover Rwanda’s Intore dance tradition, music and performance clothing through a sample guided cultural session.', offerings: ['Intore dance', 'Traditional music', 'Performance art'], image: photos.music },
  { title: 'Imigongo & Agaseke Craft Workshop', category: 'Heritage & culture', location: 'Kigali & Eastern Province', description: 'A sample artisan-led introduction to Imigongo paintings and Agaseke basket weaving, with opportunities to discover locally made work.', offerings: ['Imigongo paintings', 'Agaseke baskets', 'Traditional art'], image: photos.art },
  { title: 'Rwanda Coffee Experience', category: 'Heritage & culture', location: 'Kigali & coffee-growing regions', description: 'An illustrative tasting journey from coffee growing and roasting to brewing, with a tea-tasting option.', offerings: ['Rwandan coffee', 'Tea tasting', 'Roasting & brewing'], image: photos.coffee, featured: true },
  { title: 'Rwandan Kitchen & Cooking Experience', category: 'Heritage & culture', location: 'Kigali', description: 'A sample cooking session introducing traditional cuisine, local ingredients and shared meals.', offerings: ['Traditional cuisine', 'Cooking experiences', 'Local ingredients'], image: photos.food },
  { title: 'Kigali Digital Solutions Studio', category: 'Business & services', location: 'Kigali', description: 'Illustrative business profile for software development, IT support and digital transformation services.', offerings: ['Technology & IT', 'Software', 'Business IT support'], image: photos.technology },
  { title: 'Rwanda Finance & Advisory Collective', category: 'Business & services', location: 'Kigali', description: 'A sample showcase for banking, financial-service discovery, accounting and business advice. No financial provider endorsement is implied.', offerings: ['Banking & financial services', 'Professional services', 'Accounting'], image: photos.building },
  { title: 'Kigali Build & Property Studio', category: 'Business & services', location: 'Kigali', description: 'Illustrative company profile for construction, real-estate services and commercial property support.', offerings: ['Construction', 'Real estate', 'Property services'], image: photos.building },
  { title: 'Rwanda Agribusiness Connect', category: 'Business & services', location: 'Across Rwanda', description: 'A sample business showcase linking agricultural producers with buyers, processors and distribution services.', offerings: ['Agriculture', 'Agribusiness', 'Local produce'], image: photos.farming },
  { title: 'Kigali Hospitality & Logistics Hub', category: 'Business & services', location: 'Kigali', description: 'Illustrative service profile for stays, airport transfers, destination planning and business deliveries.', offerings: ['Tourism & hospitality', 'Transport & logistics', 'Airport transfers'], image: photos.transport },
  { title: 'Kigali Retail & Shopping Collective', category: 'Business & services', location: 'Kigali', description: 'A sample local retail directory for shops, product showcases and seasonal promotions.', offerings: ['Retail & shopping', 'Product discovery', 'Business promotions'], image: photos.fashion },
  { title: 'Rwanda Wellness & Learning Network', category: 'Business & services', location: 'Kigali', description: 'Illustrative profiles for healthcare and wellness services, education providers and skills-training programmes. Qualifications must be checked with each provider.', offerings: ['Healthcare & wellness', 'Education & training', 'Professional development'], image: photos.wellness },
  { title: 'Kigali Conference & Meeting Facilities', category: 'Conference & business venues', location: 'Kigali', description: 'A sample venue profile for conference halls and hotel meeting facilities. Capacity, equipment, rates and availability require confirmation.', offerings: ['Conference halls', 'Hotel meeting facilities', 'Corporate events'], image: photos.meeting, featured: true },
  { title: 'Kigali Boardroom & Training Suites', category: 'Conference & business venues', location: 'Kigali', description: 'Illustrative spaces for board meetings, training sessions and seminars, with suggested AV and catering enquiry topics.', offerings: ['Boardrooms', 'Training rooms', 'Seminar rooms'], image: photos.training },
  { title: 'Rwanda Celebration & Exhibition Spaces', category: 'Conference & business venues', location: 'Kigali', description: 'A sample venue collection for weddings, private events and exhibitions. No venue booking or capacity is advertised as confirmed.', offerings: ['Wedding venues', 'Event venues', 'Exhibition spaces'], image: photos.networking },
  { title: 'Kigali Co-working Community', category: 'Conference & business venues', location: 'Kigali', description: 'Illustrative flexible workspaces for entrepreneurs, remote workers and small teams, with meeting-room and day-pass concepts.', offerings: ['Co-working spaces', 'Meeting rooms', 'Team workspaces'], image: photos.technology },
  { title: 'Musanze Adventure Experiences', category: 'Tourism & experiences', location: 'Musanze & Volcanoes National Park', description: 'An example trip-planning showcase for gorilla trekking, Volcanoes National Park visits and guided hiking. Permits, current requirements and operator availability must be confirmed.', offerings: ['Gorilla trekking', 'Volcanoes National Park', 'Hiking & adventure'], image: photos.nature, featured: true },
  { title: 'Akagera Wildlife Safari', category: 'Tourism & experiences', location: 'Akagera National Park', description: 'A sample wildlife itinerary with guided game drives and nature discovery. Entry fees, guides and current access are not included or confirmed.', offerings: ['Akagera wildlife safaris', 'Game drives', 'Nature experiences'], image: photos.nature },
  { title: 'Lake Kivu Weekend Escape', category: 'Tourism & experiences', location: 'Rubavu & Karongi', description: 'An illustrative Lake Kivu getaway combining lakeside stays, boat experiences and relaxed local discovery.', offerings: ['Lake Kivu', 'Lakeside stays', 'Boat experiences'], image: photos.lake, featured: true },
  { title: 'Nyungwe Forest Discovery', category: 'Tourism & experiences', location: 'Nyungwe National Park', description: 'A sample forest visit for canopy walks, guided nature trails and nearby tea-growing landscapes. Check permits, trail access and guide requirements.', offerings: ['Nyungwe Forest', 'Canopy walks', 'Tea plantation visits'], image: photos.nature },
  { title: 'Kigali City & Plantation Trails', category: 'Tourism & experiences', location: 'Kigali & growing regions', description: 'An example itinerary pairing city tours with coffee and tea plantation visits arranged through local guides.', offerings: ['Kigali city tours', 'Coffee plantation visits', 'Tea plantation visits'], image: photos.coffee },
  { title: 'Rwandan Art and Crafts Marketplace', category: 'Shopping & local products', location: 'Kigali', description: 'A sample collection of traditional crafts, art and souvenirs, including Imigongo work and Agaseke baskets.', offerings: ['Traditional crafts', 'Art & souvenirs', 'Agaseke baskets'], image: photos.art, featured: true },
  { title: 'Kigali Fashion & Lifestyle Edit', category: 'Shopping & local products', location: 'Kigali', description: 'An illustrative product showcase for local fashion, clothing, beauty and lifestyle businesses.', offerings: ['Fashion & clothing', 'Beauty', 'Lifestyle products'], image: photos.fashion },
  { title: 'Rwanda Harvest & Coffee Market', category: 'Shopping & local products', location: 'Across Rwanda', description: 'A sample marketplace collection for local agricultural products, packaged coffee and tea.', offerings: ['Local agricultural products', 'Coffee & tea', 'Food products'], image: photos.coffee },
  { title: 'Kigali Home & Electronics Showcase', category: 'Shopping & local products', location: 'Kigali', description: 'Illustrative retailer profiles for furniture, electronics and home essentials, with product details to be supplied by actual merchants.', offerings: ['Electronics', 'Furniture', 'Home products'], image: photos.technology },
];
