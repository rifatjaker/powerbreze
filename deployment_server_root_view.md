/domains/powerbreeze.ca/
├── public_html/                  # Website document root
│   ├── .htaccess                 # frontend/public থেকে build-এ কপি হবে
│   ├── index.html                # frontend/dist থেকে
│   ├── assets/                   # frontend/dist/assets থেকে
│   ├── uploads/
│   │   ├── projects/
│   │   │   └── .htaccess          # project image uploads
│   │   ├── services/
│   │   │   └── .htaccess          # service image uploads
│   │   ├── products/
│   │       └── .htaccess          # product image uploads
│   │   └── clients/
│   │       └── .htaccess          # client logo uploads
│   └── api/                       # frontend/public/api/ থেকে build-এ কপি হবে
│       ├── .htaccess
│       └── index.php              # wrapper; public API URL /api/index.php
│
└── backend/                       # public_html-এর বাইরে; সরাসরি web-accessible নয়
    ├── .env                       # DB/JWT/admin settings; কখনও public_html-এ নয়
    ├── composer.json
    ├── composer.lock              # Composer install-এ তৈরি হবে
    ├── vendor/
    │   ├── autoload.php
    │   ├── composer/
    │   └── firebase/
    ├── api/                        # আসল private PHP API code
    │   ├── index.php
    │   ├── auth.php
    │   ├── bootstrap.php
    │   ├── database.php
    │   └── .htaccess
    ├── database/
    │   ├── schema.sql
    │   └── migrations/
    │       └── 005_client_management.sql
    └── scripts/
        └── create-admin.php

Local source mapping: `frontend/public/api/index.php` builds to
`public_html/api/index.php`. That wrapper is separate from the real API source at
`backend/api/index.php`.

Wrapper contents:

```php
<?php
require_once dirname(__DIR__, 2) . '/backend/api/index.php';
```

অর্থাৎ `public_html/api/` public request গ্রহণ করে, আর `backend/api/`-এর PHP
code, `.env`, Composer dependencies ও database scripts public_html-এর বাইরে থাকে।