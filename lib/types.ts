export type Settings = Record<string, string>;

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  icon: string;
  features: string[];
  sort_order: number;
}

export interface Step {
  step_no: number;
  title: string;
  description: string;
  icon: string;
}

export interface WhyCard {
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface Stat {
  value: string;
  label: string;
  description: string;
  sort_order: number;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  sort_order: number;
}

export interface DigitalProduct {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;          // in paise
  original_price: number; // in paise, 0 = no strike-through
  category: string;
  preview_image: string;
  preview_images: string[];  // additional gallery images
  features: string[];        // "What you get" bullet points
  highlights: string[];      // key stats / short highlights
  pages_count: number;       // e.g. 50
  file_size: string;         // e.g. "2.7 MB"
  file_url: string;
  is_featured: boolean;
  sort_order: number;
}

export interface Page {
  slug: string;
  title: string;
  subtitle: string;
  content: string;
}
