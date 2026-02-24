export interface NavLink {
  label: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  speed: string;
  range: string;
  image: string;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}
