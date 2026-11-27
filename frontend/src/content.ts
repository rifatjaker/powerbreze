export type Service = {
  id: number;
  title: string;
  category: string;
  summary: string;
  icon: string;
  image: string;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string | null;
};

export type Project = {
  id: number;
  title: string;
  client: string;
  location: string;
  year: string;
  image: string;
  size: string;
};

export type Client = {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
};

export type GalleryImage = {
  id: number;
  title: string;
  image: string;
};

export type CompanyProfile = {
  id: number;
  company_name: string;
  tagline: string;
  founded_year: number;
  about_intro: string;
  about_body: string;
  profile_summary: string;
  profile_leadership: string;
  profile_credentials: string;
  profile_capabilities: string;
  email: string;
  facebook_url: string;
  youtube_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  whatsapp_phone: string;
  office_bd_address: string;
  office_bd_phone: string;
  office_bd_mobile: string;
  office_bd_fax: string;
  office_local_address: string;
  office_local_phone: string;
  office_ctg_address: string;
  office_factory_address: string;
  office_ca_address: string;
  office_ca_phone: string;
};

export const emptyCompanyProfile: CompanyProfile = {
  id: 0,
  company_name: "",
  tagline: "",
  founded_year: 0,
  about_intro: "",
  about_body: "",
  profile_summary: "",
  profile_leadership: "",
  profile_credentials: "",
  profile_capabilities: "",
  email: "",
  facebook_url: "",
  youtube_url: "",
  twitter_url: "",
  linkedin_url: "",
  instagram_url: "",
  whatsapp_phone: "",
  office_bd_address: "",
  office_bd_phone: "",
  office_bd_mobile: "",
  office_bd_fax: "",
  office_local_address: "",
  office_local_phone: "",
  office_ctg_address: "",
  office_factory_address: "",
  office_ca_address: "",
  office_ca_phone: "",
};

export const slides = [
  {
    kicker: "Engineered for what's next",
    title: "Powering progress.\nBuilding possibility.",
    body: "Integrated power and electro-mechanical solutions for the infrastructure shaping tomorrow.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2200&q=90",
    badge: "Power infrastructure",
  },
  {
    kicker: "From design to commissioning",
    title: "One partner.\nEvery connection.",
    body: "Substations, switchgear, generators and turnkey delivery—planned around your project.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2200&q=90",
    badge: "Turnkey delivery",
  },
  {
    kicker: "A brighter energy future",
    title: "Modern energy.\nMade dependable.",
    body: "Renewable power, dependable systems and equipment supply for a changing world.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2200&q=90",
    badge: "Solar & power systems",
  },
];
