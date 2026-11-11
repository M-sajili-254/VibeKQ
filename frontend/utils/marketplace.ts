export interface Photo {
  id: string;
  image: string;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  code: string;
  airport_code: string;
  airport_name: string;
  description: string;
  hero_tagline: string;
  highlights: string[];
  is_demo: boolean;
  display_image?: string | null;
  image_url?: string | null;
  image?: string | null;
  airport_services_count: number;
  destination_services_count: number;
}

export interface Merchant {
  id: string;
  business_name: string;
  business_category: string;
  community_summary: string;
  community_type: string;
  destination: string;
  destination_name: string;
  service_tags: string[];
  is_demo: boolean;
  photos: Photo[];
  display_image?: string | null;
}

export interface Service {
  id: string;
  name: string;
  category_name: string;
  provider_name: string;
  description: string;
  location_label: string;
  community_type: string;
  price: string;
  currency: string;
  is_demo: boolean;
  display_image?: string | null;
  image_url?: string | null;
  image?: string | null;
}

export interface Ecosystem {
  destination: Destination;
  communities: Record<'airport' | 'destination', { partners: Merchant[]; services: Service[] }>;
}

const priorityCities = ['Kigali', 'Nairobi', 'New York', 'Bangkok'];

export const sortDestinations = (destinations: Destination[]) =>
  [...destinations].sort((a, b) => {
    const rank = (city: string) => {
      const index = priorityCities.indexOf(city);
      return index === -1 ? priorityCities.length : index;
    };
    return rank(a.city) - rank(b.city);
  });
