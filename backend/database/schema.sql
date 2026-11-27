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
  must_change_password TINYINT(1) NOT NULL DEFAULT 1,
  auth_version INT UNSIGNED NOT NULL DEFAULT 1,
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
  profile_summary TEXT NOT NULL,
  profile_leadership TEXT NOT NULL,
  profile_credentials TEXT NOT NULL,
  profile_capabilities TEXT NOT NULL,
  email VARCHAR(190) NOT NULL,
  facebook_url VARCHAR(2048) NOT NULL DEFAULT '',
  youtube_url VARCHAR(2048) NOT NULL DEFAULT '',
  twitter_url VARCHAR(2048) NOT NULL DEFAULT '',
  linkedin_url VARCHAR(2048) NOT NULL DEFAULT '',
  instagram_url VARCHAR(2048) NOT NULL DEFAULT '',
  whatsapp_phone VARCHAR(24) NOT NULL,
  office_bd_address VARCHAR(500) NOT NULL,
  office_bd_phone VARCHAR(50) NOT NULL,
  office_bd_mobile VARCHAR(50) NULL,
  office_bd_fax VARCHAR(50) NULL,
  office_local_address VARCHAR(500) NULL,
  office_local_phone VARCHAR(50) NULL,
  office_ctg_address VARCHAR(500) NULL,
  office_factory_address VARCHAR(500) NULL,
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

CREATE TABLE IF NOT EXISTS clients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(220) NOT NULL,
  description TEXT NULL,
  image VARCHAR(2048) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(220) NOT NULL,
  image VARCHAR(2048) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
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
  id, company_name, tagline, founded_year, about_intro, about_body,
  profile_summary, profile_leadership, profile_credentials, profile_capabilities,
  email, whatsapp_phone,
  office_bd_address, office_bd_phone, office_bd_mobile, office_bd_fax,
  office_local_address, office_local_phone, office_ctg_address, office_factory_address,
  office_ca_address, office_ca_phone
)
SELECT
  1,
  'Power Breeze Engineering',
  'Powering progress. Building possibility.',
  2012,
  'Since 2012, Power Breeze Engineering has helped public and private organizations deliver critical power and electro-mechanical infrastructure.',
  'From site survey and planning to equipment supply, installation, testing and commissioning, our teams bring the pieces together—thoughtfully, safely and with attention to the details that keep projects moving.',
  'Established in 2012, Power Breeze Engineering is a Bangladesh-based electro-mechanical contractor serving public and private sector projects. The company delivers power infrastructure work from survey and planning through equipment supply, installation, testing and commissioning.',
  'Founded by Engr. Ahsan Bin Bashar (Ripon), a mechanical engineering graduate of Bangladesh University of Engineering and Technology (BUET) with an MBA in Management Information Systems from the University of Dhaka.',
  CONCAT('First-class electro-mechanical contractor', CHAR(10), 'ABC Electrical Contractor license', CHAR(10), 'Electrical Supervisor license'),
  CONCAT(
    '132/33/11 kV substation equipment supply, installation, testing and commissioning', CHAR(10),
    'Transformers, HT/LT switchgear, generators, synchronizing panels and busbar trunking', CHAR(10),
    'HT/LT cable laying, overhead power lines, earthing and lightning protection', CHAR(10),
    'Solar systems, industrial lighting, HVAC and elevator systems', CHAR(10),
    'Turnkey electro-mechanical and civil works'
  ),
  'info@powerbreeze.ca',
  '8801711520071',
  'Dr. Nawab Ali Tower, Suite #501E (5th Floor), 24/A Purana Paltan, Dhaka-1000, Bangladesh',
  '+88-02-9585474',
  '+88-01819244217',
  '+88-02-9574977',
  '438, Abedin Market (3rd Floor East), Noyapara, Sonirakhra, P.O. Dania, P.S. Jatrabari, Dhaka-1236',
  '+880 1819 244217',
  'Swapno Shomo, Flat #B-1, House #93, Road #08, O.R. Nizam Road, Chattogram, Bangladesh',
  'Shahid Nagar, Matuail, Narayanganj Road, Dhaka-1236, Bangladesh',
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
  SELECT 'Substation Transformer' name, 'Substation equipment' category, 'Transformer solutions for utility and industrial substations. Ratings and configurations are confirmed against project requirements.' description, '/uploads/products/transformer-01.jpg' image, 1 sort_order
  UNION ALL SELECT 'Power Transformer', 'Substation equipment', 'Power transformer equipment for reliable voltage transformation and distribution.', '/uploads/products/transformer-02.jpg', 2
  UNION ALL SELECT 'Medium-Voltage Switchgear', 'Substation equipment', 'Switchgear solutions for protection, isolation and control in substation installations.', '/uploads/products/transformer-03.png', 3
  UNION ALL SELECT 'Distribution Box', 'Distribution', 'Low-voltage enclosures configured around site circuits and connected loads.', '/uploads/products/distribution-box-01.jpg', 4
  UNION ALL SELECT 'Low-Voltage Distribution Panel', 'Distribution', 'Distribution and switchgear panels for managing low-voltage power systems.', '/uploads/products/distribution-box-03.jpg', 5
  UNION ALL SELECT 'Synchronizing & Common-Bus Panel', 'Generator control', 'Synchronizing and common-bus panel solutions for coordinated generator operation.', '/uploads/products/synchronizing-panel-01.jpg', 6
  UNION ALL SELECT 'Generator Synchronizing Panel', 'Generator control', 'Control panel equipment for synchronizing generators with project power systems.', '/uploads/products/synchronizing-panel-02.jpg', 7
  UNION ALL SELECT 'Generator Control Panel', 'Generator control', 'Generator control and monitoring panels for dependable power operations.', '/uploads/products/synchronizing-panel-03.jpg', 8
  UNION ALL SELECT 'Solar Power System', 'Solar power', 'Solar generation systems planned around site conditions and project requirements.', '/uploads/products/solar-system-01.jpg', 9
  UNION ALL SELECT 'Grid-Tied Solar System', 'Solar power', 'Grid-connected photovoltaic systems for integrating solar generation with site loads.', '/uploads/products/solar-system-02.png', 10
  UNION ALL SELECT 'SPS300 Solar Power System', 'Solar power', 'A compact solar power system for small-scale backup and off-grid applications.', '/uploads/products/solar-system-03.jpg', 11
  UNION ALL SELECT 'European-Brand Diesel Generator', 'Diesel generation', 'Diesel generator equipment for standby and prime power applications.', '/uploads/products/diesel-generator-01.jpg', 12
  UNION ALL SELECT 'CAT Diesel Generator Set', 'Diesel generation', 'CAT generator sets for dependable standby or prime power, specified per project.', '/uploads/products/diesel-generator-02.png', 13
  UNION ALL SELECT 'Doosan Diesel Generator Set', 'Diesel generation', 'Doosan generator equipment supplied to meet project capacity and operating needs.', '/uploads/products/diesel-generator-03.jpg', 14
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

INSERT INTO clients (name, image, sort_order, is_published)
SELECT seed.name, seed.image, seed.sort_order, 1
FROM (
  SELECT 'Dhaka Power Distribution Company Limited (DPDC) North' name, '/uploads/clients/dpdc.png' image, 1 sort_order
  UNION ALL SELECT 'Dockyard & Engineering Works Ltd. (An Enterprise of Bangladesh Navy)', NULL, 2
  UNION ALL SELECT 'Bangladesh University of Professionals (BUP)', NULL, 3
  UNION ALL SELECT 'Dhaka Power Distribution Company Limited (DPDC), North Project Division-2', NULL, 4
  UNION ALL SELECT 'Bangladesh Power Development Board (BPDB)', NULL, 5
  UNION ALL SELECT 'Agrani Bank Limited Head Office', '/uploads/clients/agrani-bank.jpg', 6
  UNION ALL SELECT 'Southeast Bank Limited, Bangshal Branch', NULL, 7
  UNION ALL SELECT 'University of Dhaka', '/uploads/clients/university-dhaka.png', 8
  UNION ALL SELECT 'National Housing Authority (NHA)', '/uploads/clients/nha.jpg', 9
  UNION ALL SELECT 'Sher-e-Bangla Agricultural University', '/uploads/clients/sau.jpg', 10
  UNION ALL SELECT 'Public Works Department, Chandpur', NULL, 11
  UNION ALL SELECT 'Education Engineering Department', NULL, 12
  UNION ALL SELECT 'Bangladesh Telecommunications Company Ltd. (BTCL)', '/uploads/clients/btcl.jpg', 13
  UNION ALL SELECT 'Hajee Mohammad Danesh Science and Technology University', NULL, 14
  UNION ALL SELECT 'Mawlana Bhashani Science and Technology University', NULL, 15
  UNION ALL SELECT 'Institute of Child and Mother Health', NULL, 16
  UNION ALL SELECT 'Jagannath University', NULL, 17
  UNION ALL SELECT 'Jahangirnagar University', NULL, 18
  UNION ALL SELECT 'Bangladesh University of Engineering and Technology (BUET)', '/uploads/clients/buet.png', 19
  UNION ALL SELECT 'Wuhan Fiberhome Technical Services Co., Ltd.', NULL, 20
  UNION ALL SELECT 'Gas Transmission Company Limited (GTCL)', NULL, 21
  UNION ALL SELECT 'Bangladesh China Friendship Exhibition Center Project, Export Promotion Bureau', NULL, 22
  UNION ALL SELECT 'Dhaka Power Distribution Company Limited (DPDC) South', NULL, 23
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM clients);
