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

INSERT INTO gallery_images (title, image, sort_order, is_published)
WITH RECURSIVE legacy_gallery (gallery_number) AS (
  SELECT 1
  UNION ALL
  SELECT gallery_number + 1
  FROM legacy_gallery
  WHERE gallery_number < 61
)
SELECT
  CONCAT('Project Gallery ', gallery_number),
  CONCAT(
    '/uploads/gallery/',
    CASE
      WHEN gallery_number <= 11 THEN CONCAT('g', gallery_number, '.jpg')
      WHEN gallery_number <= 53 THEN CONCAT(gallery_number + 6, '.jpg')
      ELSE CONCAT('g', gallery_number - 41, '.png')
    END
  ),
  gallery_number,
  1
FROM legacy_gallery
WHERE NOT EXISTS (
  SELECT 1
  FROM gallery_images existing
  WHERE existing.image = CONCAT(
    '/uploads/gallery/',
    CASE
      WHEN legacy_gallery.gallery_number <= 11 THEN CONCAT('g', legacy_gallery.gallery_number, '.jpg')
      WHEN legacy_gallery.gallery_number <= 53 THEN CONCAT(legacy_gallery.gallery_number + 6, '.jpg')
      ELSE CONCAT('g', legacy_gallery.gallery_number - 41, '.png')
    END
  )
);
