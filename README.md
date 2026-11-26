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
one-way password hash in MySQL.

### 3. Run the frontend

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The Vite development server proxies
`/api` requests to `http://localhost:8000`.

Open `/admin` to sign in and manage services, products, projects, and submitted
inquiries.

## Production deployment

Build the website from `frontend/` using `npm run build`. Deploy the contents of
`frontend/dist` to the public web root, and deploy `backend/api` under `/api` on
a PHP 8 host. The site and API should use HTTPS. If the API uses a different
origin, set `VITE_API_URL` at build time and configure `CORS_ORIGINS` on the API
to allow only the production website origin.

Set production database credentials, `JWT_SECRET`, `JWT_ISSUER`, `JWT_TTL`, and
allowed origins in the backend environment. Do not put secrets in frontend
environment variables. Configure the web server to route the `/admin` path to
the frontend `index.html` and keep `.env`, Composer files, and database scripts
outside the public web root.

The starter site content and project details are based on the existing company
website. Verify project/client publication permissions, credentials, product
specifications, availability, and office contact details before production.
