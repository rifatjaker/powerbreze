# Power Breeze Engineering Website

Responsive company website and content administration system for Power Breeze Engineering.

## Technology

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** PHP 8 REST API
- **Database:** MySQL 8
- **Admin authentication:** short-lived JWT access tokens sent in the `Authorization: Bearer <token>` header

## Project layout

```text
frontend/       React/Vite website and admin portal
backend/        PHP API, MySQL schema, Composer dependencies, and setup scripts
backend/database/ MySQL schema and initial catalogue records
SRS.md          Website requirements
SRS.html        Styled requirements document
```

## Run locally

### 1. Configure MySQL

Create the schema and seed the starter catalogue:

```sh
mysql -u root -p < backend/database/schema.sql
```

### 2. Configure and run the PHP API

```sh
cd backend
copy .env.example .env
composer install
php -S localhost:8000 -t .
```

Set the database credentials and a private random `JWT_SECRET` in `backend/.env`.
Use a unique secret of at least 32 characters. Never commit `.env`.

Create the first administrator by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in
`backend/.env`, then running:

```sh
php scripts/create-admin.php
```

Use an administrator password with at least 12 characters. The script stores a
one-way password hash in MySQL and requires a password change at the first
sign-in. After choosing a new password, the administrator must sign in again.

If upgrading a database created before the first-login password flow, apply this
migration once before running the admin setup script:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/001_admin_password_setup.sql
```

The migration marks existing admin accounts for a mandatory password change.
Do not run it after importing the updated `schema.sql`.

To update the public company contact email on an existing database, run:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/002_company_contact_email.sql
```

To add the editable company profile fields to an existing database, run this once:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/003_company_profile_content.sql
```

To add the company office locations and corporate phone/fax fields, run:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/004_company_office_locations.sql
```

After applying it, update all office addresses and contact numbers from
`/admin-login` → **Company profile & offices**. Each configured location appears
in the website contact section with an embedded Google Map and a details modal.

To add editable social media links to the company profile on an existing database,
run:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/009_company_social_links.sql
```

Set any Facebook, YouTube, Twitter/X, LinkedIn, or Instagram URLs from
`/admin-login` → **Company profile & offices**. Only configured links appear as
social icons in the website footer.

To add the client directory and its existing client references, run:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/005_client_management.sql
```

The historical client references were initially imported as drafts. To publish the
23 entries that appeared on the legacy public client page, apply this migration after
`005_client_management.sql`:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/007_publish_legacy_clients.sql
```

It leaves other client records unchanged. New client records remain drafts until
published from `/admin-login` → **Clients**. New client logos can be uploaded there
as JPG, PNG, or WebP files up to 5 MB.

To load the legacy product catalogue and its local product images into an existing
database, run:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/006_legacy_product_catalogue.sql
```

The migration keeps the original starter products as drafts, imports the legacy
catalogue, and leaves uploaded/custom product records unchanged. On the homepage,
the product preview links to `/products` when more than eight products are available.

To create the paginated project gallery and import the legacy gallery photos, run:

```sh
mysql -u root -p powerbreeze < backend/database/migrations/008_gallery_management.sql
```

This migration imports 61 locally hosted images from the former public gallery and
skips photos already present. The homepage shows 12 published gallery images per
page. Manage captions, ordering, visibility, and uploaded images from
`/admin-login` → **Gallery**.

### 3. Run the frontend

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The Vite development server proxies
`/api` requests to `http://localhost:8000`.

Open `/admin-login` to sign in and manage the company profile and offices, services,
products, projects, clients, gallery images, and submitted inquiries.
The public site reads company, service, product, project, client, and office content from
the database only; it does not substitute bundled sample records. Empty sections
display “Coming soon”. If the API/database cannot be reached, the site reports that
the content could not be loaded instead of presenting stale fallback content.
Service, product, project, client, and gallery images can be uploaded directly from
their admin editors as JPG, PNG, or WebP files up to 5 MB. They are saved under
`public_html/uploads/services/`, `public_html/uploads/products/`,
`public_html/uploads/projects/`, `public_html/uploads/clients/`, and
`public_html/uploads/gallery/`; ensure the PHP/web-server account can create and
write those directories. Each upload
directory's `.htaccess` disables directory listings and denies script files. For
PHP hosting, set `upload_max_filesize` to at least `5M` and `post_max_size` to at
least `6M`.

## Production deployment

Build the website from `frontend/` using `npm run build`. The Apache `.htaccess`
in `frontend/public/` is copied into `frontend/dist/`; deploy the contents of
`frontend/dist` to the public web root together, including `index.html`, the full
`assets/` directory, uploads, and `.htaccess`. Do not deploy only the HTML or only
the assets: the HTML references build-hashed filenames. After deployment, hard
refresh the browser or purge any CDN/page cache if it still requests an old asset.
The root `.htaccess` marks `index.html` as non-cacheable to prevent stale asset
references. The API wrapper in
`frontend/public/api/` is also copied to `frontend/dist/api/`; deploy the
repository's `backend/` folder beside `public_html/`, not inside it. The site
and API should use HTTPS. If the API uses a different
origin, set `VITE_API_URL` at build time and configure `CORS_ORIGINS` on the API
to allow only the `https://powerbreeze.ca` production website origin.

Set production database credentials, `JWT_SECRET`, `JWT_ISSUER`, `JWT_TTL`, and
allowed origins in the backend environment. Do not put secrets in frontend
environment variables. The `.htaccess` rewrite serves client-side routes such as
`/admin-login` through `index.html` while leaving `/api/` requests to PHP. Keep
`.env`, Composer files, and database scripts outside the public web root.

The starter site content and project details are based on the existing company
website. Verify project/client publication permissions, credentials, product
specifications, availability, and office contact details before production.
