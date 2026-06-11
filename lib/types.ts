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

export interface Page {
  slug: string;
  title: string;
  subtitle: string;
  content: string;
}
