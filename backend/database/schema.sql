CREATE DATABASE IF NOT EXISTS powerbreeze
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE powerbreeze;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY admins_email_unique (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_attempts (
  ip_hash CHAR(64) NOT NULL,
  attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ip_hash)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS company_settings (
  id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  company_name VARCHAR(180) NOT NULL,
  tagline VARCHAR(240) NOT NULL,
  founded_year SMALLINT UNSIGNED NOT NULL,
  about_intro TEXT NOT NULL,
  about_body TEXT NOT NULL,
  email VARCHAR(190) NOT NULL,
  whatsapp_phone VARCHAR(24) NOT NULL,
  office_bd_address VARCHAR(500) NOT NULL,
  office_bd_phone VARCHAR(50) NOT NULL,
  office_local_address VARCHAR(500) NULL,
  office_local_phone VARCHAR(50) NULL,
  office_ca_address VARCHAR(500) NULL,
  office_ca_phone VARCHAR(50) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  icon VARCHAR(60) NOT NULL DEFAULT 'Zap',
  image VARCHAR(2048) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(2048) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(220) NOT NULL,
  client VARCHAR(180) NOT NULL,
  location VARCHAR(180) NOT NULL,
  year VARCHAR(30) NULL,
  size VARCHAR(80) NULL,
  image VARCHAR(2048) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  organization VARCHAR(160) NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(50) NULL,
  inquiry_type VARCHAR(80) NOT NULL DEFAULT 'General',
  subject VARCHAR(200) NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY inquiries_created_at_idx (created_at),
  KEY inquiries_status_idx (status)
) ENGINE=InnoDB;

INSERT INTO company_settings (
  id, company_name, tagline, founded_year, about_intro, about_body, email, whatsapp_phone,
  office_bd_address, office_bd_phone, office_local_address, office_local_phone, office_ca_address, office_ca_phone
)
SELECT
  1,
  'Power Breeze Engineering',
  'Powering progress. Building possibility.',
  2012,
  'Since 2012, Power Breeze Engineering has helped public and private organizations deliver critical power and electro-mechanical infrastructure.',
  'From site survey and planning to equipment supply, installation, testing and commissioning, our teams bring the pieces together—thoughtfully, safely and with attention to the details that keep projects moving.',
  'info@powerbreezebd.net',
  '8801711520071',
  'Dr. Nawab Ali Tower, Suite #501E, 24/A Purana Paltan, Dhaka-1000, Bangladesh',
  '+880 1711 520071',
  '438 Abedin Market (3rd Floor), Noyapara, Sonirakhra, P.O. Dania, P.S. Jatrabari, Dhaka-1236',
  '+880 1819 244217',
  'Suite 31, Workplace K Ltd, 1940 Eglinton Ave East, Scarborough, ON M1L 4R1',
  '+1 647 332 4217'
WHERE NOT EXISTS (SELECT 1 FROM company_settings WHERE id = 1);

INSERT INTO services (title, category, summary, icon, image, sort_order)
SELECT seed.title, seed.category, seed.summary, seed.icon, seed.image, seed.sort_order
FROM (
  SELECT 'Power Substations' title, 'Power infrastructure' category, 'End-to-end substation supply, installation, testing and commissioning.' summary, 'Zap' icon, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85' image, 1 sort_order
  UNION ALL SELECT 'Transformers & Switchgear', 'Power infrastructure', 'Transformer and HT/LT switchgear solutions configured around project needs.', 'Activity', 'https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85', 2
  UNION ALL SELECT 'Generators & Synchronizing', 'Power systems', 'Generator supply and installation with synchronization and common-bus panels.', 'Gauge', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85', 3
  UNION ALL SELECT 'Solar Power Systems', 'Renewable energy', 'Solar plant and solar security-light solutions for dependable energy.', 'Sun', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85', 4
  UNION ALL SELECT 'Cable, Earthing & Power Lines', 'Electrical works', 'Underground and overhead HT/LT cable, power-line and grounding works.', 'Cable', 'https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85', 5
  UNION ALL SELECT 'Industrial Electrical Works', 'Electrical works', 'Distribution boards, motor control panels, wiring and industrial lighting.', 'Factory', 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=900&q=85', 6
  UNION ALL SELECT 'Engineering & Site Survey', 'Design & planning', 'Site survey, network planning and design for power and grounding work.', 'Ruler', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85', 7
  UNION ALL SELECT 'Turnkey Electro-Mechanical', 'Turnkey projects', 'Coordinated project delivery across electro-mechanical and civil works.', 'Building2', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85', 8
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM services);

INSERT INTO products (name, category, description, image, sort_order)
SELECT seed.name, seed.category, seed.description, seed.image, seed.sort_order
FROM (
  SELECT 'Power Transformers' name, 'Substation' category, 'Distribution and substation transformer supply for utility and industrial projects.' description, 'https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85' image, 1 sort_order
  UNION ALL SELECT 'Vacuum Circuit Breakers', 'Switchgear', 'VCB and HT/LT switchgear options for reliable switching and protection.', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85', 2
  UNION ALL SELECT 'Gas-Insulated Substations', 'Substation', 'GIS equipment for compact and dependable electrical substation installations.', 'https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85', 3
  UNION ALL SELECT 'Diesel Generator Sets', 'Generation', 'Prime and standby diesel generator sets with project-specific configurations.', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85', 4
  UNION ALL SELECT 'Solar Plant Equipment', 'Renewable energy', 'Solar power system components for commercial and infrastructure applications.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85', 5
  UNION ALL SELECT 'Battery & Charger Systems', 'Power systems', 'Battery banks and chargers for dependable backup and substation control power.', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=85', 6
  UNION ALL SELECT 'Busbar Trunking (BBT)', 'Distribution', 'Busbar trunking systems for efficient power distribution in buildings and facilities.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85', 7
  UNION ALL SELECT 'Protection & Metering', 'Protection', 'CT/PT, lightning arresters, isolators, insulators and prepaid meters.', 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=900&q=85', 8
  UNION ALL SELECT 'Cables & Optical Fiber', 'Cables', 'Underground HT/LT cables and optical fiber solutions for infrastructure.', 'https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=900&q=85', 9
  UNION ALL SELECT 'Lifts & Safety Systems', 'Building systems', 'Passenger and bed elevators, lighting protection and fire safety equipment.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85', 10
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO projects (title, client, location, year, size, image)
SELECT seed.title, seed.client, seed.location, seed.year, seed.size, seed.image
FROM (
  SELECT '800 kVA Substation Upgrade' title, 'University of Dhaka' client, 'Dhaka, Bangladesh' location, '2012' year, '800 kVA' size, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85' image
  UNION ALL SELECT '11 kV Switchgear Installation', 'Dhaka Power Distribution Company', 'Dhaka, Bangladesh', '2013', '11 kV', 'https://images.unsplash.com/photo-1513828583688-c52646e6e9a3?auto=format&fit=crop&w=1200&q=85'
  UNION ALL SELECT 'Substation & LT Line Works', 'Sher-e-Bangla Agricultural University', 'Dhaka, Bangladesh', '2014', '500 kVA', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85'
  UNION ALL SELECT 'Generator Supply & Commissioning', 'Agrani Bank Training Institute', 'Dhaka, Bangladesh', '2015', '300 kVA', 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=85'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM projects);
