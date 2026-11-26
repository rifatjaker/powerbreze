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
  image: string;
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

export type CompanyProfile = {
  id: number;
  company_name: string;
  tagline: string;
  founded_year: number;
  about_intro: string;
  about_body: string;
  email: string;
  whatsapp_phone: string;
  office_bd_address: string;
  office_bd_phone: string;
  office_local_address: string;
  office_local_phone: string;
  office_ca_address: string;
  office_ca_phone: string;
};

export const companyProfile: CompanyProfile = {
  id: 1,
  company_name: "Power Breeze Engineering",
  tagline: "Powering progress. Building possibility.",
  founded_year: 2012,
  about_intro: "Since 2012, Power Breeze Engineering has helped public and private organizations deliver critical power and electro-mechanical infrastructure.",
  about_body: "From site survey and planning to equipment supply, installation, testing and commissioning, our teams bring the pieces together—thoughtfully, safely and with attention to the details that keep projects moving.",
  email: "info@powerbreezebd.net",
  whatsapp_phone: "8801711520071",
  office_bd_address: "Dr. Nawab Ali Tower, Suite #501E, 24/A Purana Paltan, Dhaka-1000, Bangladesh",
  office_bd_phone: "+880 1711 520071",
  office_local_address: "438 Abedin Market (3rd Floor), Noyapara, Sonirakhra, P.O. Dania, P.S. Jatrabari, Dhaka-1236",
  office_local_phone: "+880 1819 244217",
  office_ca_address: "Suite 31, Workplace K Ltd, 1940 Eglinton Ave East, Scarborough, ON M1L 4R1",
  office_ca_phone: "+1 647 332 4217",
};

export const services: Service[] = [
  {
    id: 1,
    title: "Power Substations",
    category: "Power infrastructure",
    summary: "End-to-end substation supply, installation, testing and commissioning.",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Transformers & Switchgear",
    category: "Power infrastructure",
    summary: "Reliable transformer and HT/LT switchgear solutions built around project needs.",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Generators & Synchronizing",
    category: "Power systems",
    summary: "Generator supply and installation with synchronization and common-bus panels.",
    icon: "Gauge",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Solar Power Systems",
    category: "Renewable energy",
    summary: "Solar plant and solar security-light solutions for dependable energy.",
    icon: "Sun",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Cable, Earthing & Power Lines",
    category: "Electrical works",
    summary: "Underground and overhead HT/LT cable, power-line and grounding works.",
    icon: "Cable",
    image: "https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "Industrial Electrical Works",
    category: "Electrical works",
    summary: "Distribution boards, motor control panels, wiring and industrial lighting.",
    icon: "Factory",
    image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    title: "Engineering & Site Survey",
    category: "Design & planning",
    summary: "Site survey, network planning and design for power and grounding work.",
    icon: "Ruler",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    title: "Turnkey Electro-Mechanical",
    category: "Turnkey projects",
    summary: "Coordinated project delivery across electro-mechanical and civil works.",
    icon: "Building2",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85",
  },
];
export const products: Product[] = [
  { id: 1, name: "Power Transformers", category: "Substation", description: "Distribution and substation transformer supply for utility and industrial projects.", image: "https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85" },
  { id: 2, name: "Vacuum Circuit Breakers", category: "Switchgear", description: "VCB and HT/LT switchgear options for reliable switching and protection.", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85" },
  { id: 3, name: "Gas-Insulated Substations", category: "Substation", description: "GIS equipment for compact and dependable electrical substation installations.", image: "https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85" },
  { id: 4, name: "Diesel Generator Sets", category: "Generation", description: "Prime and standby diesel generator sets with project-specific configurations.", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85" },
  { id: 5, name: "Solar Plant Equipment", category: "Renewable energy", description: "Solar power system components for commercial and infrastructure applications.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85" },
  { id: 6, name: "Battery & Charger Systems", category: "Power systems", description: "Battery banks and chargers for dependable backup and substation control power.", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=85" },
  { id: 7, name: "Busbar Trunking (BBT)", category: "Distribution", description: "Busbar trunking systems for efficient power distribution in buildings and facilities.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85" },
  { id: 8, name: "Protection & Metering", category: "Protection", description: "CT/PT, lightning arresters, isolators, insulators and prepaid meters.", image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=900&q=85" },
  { id: 9, name: "Cables & Optical Fiber", category: "Cables", description: "Underground HT/LT cables and optical fiber solutions for infrastructure.", image: "https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85" },
  { id: 10, name: "Lifts & Safety Systems", category: "Building systems", description: "Passenger and bed elevators, lighting protection and fire safety equipment.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85" },
];

export const projects: Project[] = [
  {
    id: 1,
    title: "800 kVA Substation Upgrade",
    client: "University of Dhaka",
    location: "Dhaka, Bangladesh",
    year: "2012",
    size: "800 kVA",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 2,
    title: "11 kV Switchgear Installation",
    client: "Dhaka Power Distribution Company",
    location: "Dhaka, Bangladesh",
    year: "2013",
    size: "11 kV",
    image: "https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 3,
    title: "Substation & LT Line Works",
    client: "Sher-e-Bangla Agricultural University",
    location: "Dhaka, Bangladesh",
    year: "2014",
    size: "500 kVA",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 4,
    title: "Generator Supply & Commissioning",
    client: "Agrani Bank Training Institute",
    location: "Dhaka, Bangladesh",
    year: "2015",
    size: "300 kVA",
    image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=85",
  },
];

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
