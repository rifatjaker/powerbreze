UPDATE products
SET is_published = 0
WHERE image LIKE 'https://images.unsplash.com/%'
  AND name IN (
    'Power Transformers',
    'Vacuum Circuit Breakers',
    'Gas-Insulated Substations',
    'Diesel Generator Sets',
    'Solar Plant Equipment',
    'Battery & Charger Systems',
    'Busbar Trunking (BBT)',
    'Protection & Metering',
    'Cables & Optical Fiber',
    'Lifts & Safety Systems'
  );

INSERT INTO products (name, category, description, image, sort_order, is_published)
SELECT seed.name, seed.category, seed.description, seed.image, seed.sort_order, 1
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
WHERE NOT EXISTS (
  SELECT 1 FROM products existing WHERE existing.image = seed.image
);
