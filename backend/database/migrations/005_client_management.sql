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

INSERT INTO clients (name, image, sort_order, is_published)
SELECT seed.name, seed.image, seed.sort_order, 0
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
