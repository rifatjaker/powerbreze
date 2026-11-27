ALTER TABLE company_settings
  ADD COLUMN office_bd_mobile VARCHAR(50) NULL,
  ADD COLUMN office_bd_fax VARCHAR(50) NULL,
  ADD COLUMN office_ctg_address VARCHAR(500) NULL,
  ADD COLUMN office_factory_address VARCHAR(500) NULL;

UPDATE company_settings
SET
  office_bd_address = 'Dr. Nawab Ali Tower, Suite #501E (5th Floor), 24/A Purana Paltan, Dhaka-1000, Bangladesh',
  office_bd_phone = '+88-02-9585474',
  office_bd_mobile = '+88-01819244217',
  office_bd_fax = '+88-02-9574977',
  office_local_address = '438, Abedin Market (3rd Floor East), Noyapara, Sonirakhra, P.O. Dania, P.S. Jatrabari, Dhaka-1236',
  office_ctg_address = 'Swapno Shomo, Flat #B-1, House #93, Road #08, O.R. Nizam Road, Chattogram, Bangladesh',
  office_factory_address = 'Shahid Nagar, Matuail, Narayanganj Road, Dhaka-1236, Bangladesh'
WHERE id = 1;
