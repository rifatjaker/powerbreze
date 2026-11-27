ALTER TABLE company_settings
  ADD COLUMN profile_summary TEXT NULL,
  ADD COLUMN profile_leadership TEXT NULL,
  ADD COLUMN profile_credentials TEXT NULL,
  ADD COLUMN profile_capabilities TEXT NULL;

UPDATE company_settings
SET
  profile_summary = COALESCE(NULLIF(profile_summary, ''), 'Established in 2012, Power Breeze Engineering is a Bangladesh-based electro-mechanical contractor serving public and private sector projects. The company delivers power infrastructure work from survey and planning through equipment supply, installation, testing and commissioning.'),
  profile_leadership = COALESCE(NULLIF(profile_leadership, ''), 'Founded by Engr. Ahsan Bin Bashar (Ripon), a mechanical engineering graduate of Bangladesh University of Engineering and Technology (BUET) with an MBA in Management Information Systems from the University of Dhaka.'),
  profile_credentials = COALESCE(NULLIF(profile_credentials, ''), CONCAT('First-class electro-mechanical contractor', CHAR(10), 'ABC Electrical Contractor license', CHAR(10), 'Electrical Supervisor license')),
  profile_capabilities = COALESCE(NULLIF(profile_capabilities, ''), CONCAT(
    '132/33/11 kV substation equipment supply, installation, testing and commissioning', CHAR(10),
    'Transformers, HT/LT switchgear, generators, synchronizing panels and busbar trunking', CHAR(10),
    'HT/LT cable laying, overhead power lines, earthing and lightning protection', CHAR(10),
    'Solar systems, industrial lighting, HVAC and elevator systems', CHAR(10),
    'Turnkey electro-mechanical and civil works'
  ));

ALTER TABLE company_settings
  MODIFY COLUMN profile_summary TEXT NOT NULL,
  MODIFY COLUMN profile_leadership TEXT NOT NULL,
  MODIFY COLUMN profile_credentials TEXT NOT NULL,
  MODIFY COLUMN profile_capabilities TEXT NOT NULL;
