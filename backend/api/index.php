<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

try {
    $resource = (string) ($_GET['resource'] ?? '');
    $action = (string) ($_GET['action'] ?? '');
    $method = (string) ($_SERVER['REQUEST_METHOD'] ?? 'GET');

    if ($resource === 'auth' && $action === 'login') {
        login_admin(request_json());
    }

    if ($resource === 'auth' && $action === 'change-password') {
        change_admin_password();
    }

    if ($resource === 'auth' && $action === 'me' && $method === 'GET') {
        json_response(200, ['data' => require_admin()]);
    }

    $imageCollection = [
        'project-images' => 'projects',
        'service-images' => 'services',
        'product-images' => 'products',
        'client-images' => 'clients',
        'gallery-images' => 'gallery',
    ][$resource] ?? null;
    if ($imageCollection !== null) {
        if ($method !== 'POST') {
            json_response(405, ['error' => 'Method not allowed.']);
        }
        require_admin();
        upload_content_image($imageCollection);
    }

    $contentResources = [
        'company' => [
            'table' => 'company_settings',
            'columns' => [
                'company_name', 'tagline', 'founded_year', 'about_intro', 'about_body', 'email',
                'profile_summary', 'profile_leadership', 'profile_credentials', 'profile_capabilities',
                'facebook_url', 'youtube_url', 'twitter_url', 'linkedin_url', 'instagram_url',
                'whatsapp_phone', 'office_bd_address', 'office_bd_phone', 'office_local_address',
                'office_bd_mobile', 'office_bd_fax', 'office_local_phone', 'office_ctg_address',
                'office_factory_address', 'office_ca_address', 'office_ca_phone',
            ],
            'required' => [
                'company_name', 'tagline', 'founded_year', 'about_intro', 'about_body', 'email',
                'profile_summary', 'profile_leadership', 'profile_credentials', 'profile_capabilities',
                'whatsapp_phone', 'office_bd_address', 'office_bd_phone',
            ],
        ],
        'services' => [
            'table' => 'services',
            'columns' => ['title', 'category', 'summary', 'icon', 'image', 'sort_order', 'is_published'],
            'required' => ['title', 'category', 'summary'],
        ],
        'products' => [
            'table' => 'products',
            'columns' => ['name', 'category', 'description', 'image', 'sort_order', 'is_published'],
            'required' => ['name', 'category', 'description'],
        ],
        'projects' => [
            'table' => 'projects',
            'columns' => ['title', 'client', 'location', 'year', 'size', 'image', 'is_published'],
            'required' => ['title', 'client', 'location'],
        ],
        'clients' => [
            'table' => 'clients',
            'columns' => ['name', 'description', 'image', 'sort_order', 'is_published'],
            'required' => ['name'],
        ],
        'gallery' => [
            'table' => 'gallery_images',
            'columns' => ['title', 'image', 'sort_order', 'is_published'],
            'required' => ['title', 'image'],
        ],
    ];

    if (isset($contentResources[$resource])) {
        $isAdmin = false;
        if ($method !== 'GET' || has_bearer_token()) {
            require_admin();
            $isAdmin = true;
        }
        handle_content_resource($resource, $contentResources[$resource], $method, $isAdmin);
    }

    if ($resource === 'inquiries') {
        handle_inquiries($method);
    }

    json_response(404, ['error' => 'API endpoint not found.']);
} catch (Throwable $exception) {
    error_log('[PowerBreeze API] ' . $exception->getMessage());
    json_response(500, ['error' => 'The server could not complete this request.']);
}

function has_bearer_token(): bool
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    return is_string($authorization) && str_starts_with(strtolower($authorization), 'bearer ');
}

function upload_content_image(string $collection): void
{
    $upload = $_FILES['image'] ?? null;
    if (!is_array($upload)) {
        json_response(422, ['error' => 'Choose an image to upload.']);
    }

    $uploadError = (int) ($upload['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($uploadError === UPLOAD_ERR_INI_SIZE || $uploadError === UPLOAD_ERR_FORM_SIZE) {
        json_response(413, ['error' => 'Images must be 5 MB or smaller.']);
    }
    if ($uploadError !== UPLOAD_ERR_OK) {
        json_response(422, ['error' => 'The image upload failed. Choose another image and try again.']);
    }

    $temporaryPath = $upload['tmp_name'] ?? null;
    if (!is_string($temporaryPath) || !is_uploaded_file($temporaryPath)) {
        json_response(422, ['error' => 'The uploaded image could not be verified.']);
    }

    $size = filesize($temporaryPath);
    if (!is_int($size) || $size < 1) {
        json_response(422, ['error' => 'The uploaded image is empty or unreadable.']);
    }
    if ($size > 5 * 1024 * 1024) {
        json_response(413, ['error' => 'Images must be 5 MB or smaller.']);
    }

    $extensions = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($temporaryPath);
    $imageInfo = @getimagesize($temporaryPath);
    if (
        !is_string($mime)
        || !isset($extensions[$mime])
        || !is_array($imageInfo)
        || ($imageInfo['mime'] ?? null) !== $mime
    ) {
        json_response(422, ['error' => 'Use a valid JPG, PNG, or WebP image.']);
    }

    $uploadRoot = trim((string) config_value('PUBLIC_UPLOAD_DIR', ''));
    if ($uploadRoot === '') {
        $documentRoot = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), DIRECTORY_SEPARATOR);
        if ($documentRoot === '') {
            throw new RuntimeException('The public document root is unavailable for image uploads.');
        }
        $uploadRoot = $documentRoot . DIRECTORY_SEPARATOR . 'uploads';
    }
    $uploadDirectory = $uploadRoot . DIRECTORY_SEPARATOR . $collection;

    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
        error_log('[PowerBreeze API] Could not create the ' . $collection . ' image upload directory.');
        json_response(500, ['error' => 'The server could not create the image directory.']);
    }
    if (!is_writable($uploadDirectory)) {
        error_log('[PowerBreeze API] The ' . $collection . ' image upload directory is not writable.');
        json_response(500, ['error' => 'The image directory is not writable by the server.']);
    }

    $fileName = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
    if (!move_uploaded_file($temporaryPath, $uploadDirectory . DIRECTORY_SEPARATOR . $fileName)) {
        error_log('[PowerBreeze API] Could not save an uploaded ' . $collection . ' image.');
        json_response(500, ['error' => 'The server could not save the image. Check the upload directory permissions.']);
    }

    $publicBase = rtrim((string) config_value('PUBLIC_UPLOAD_URL', '/uploads'), '/')
        . '/' . $collection;
    json_response(201, ['data' => ['url' => $publicBase . '/' . $fileName]]);
}

function handle_content_resource(string $resource, array $definition, string $method, bool $isAdmin): void
{
    $pdo = db();
    $table = $definition['table'];
    $columns = $definition['columns'];

    if ($method === 'GET') {
        if ($resource === 'company') {
            $statement = $pdo->query('SELECT * FROM company_settings WHERE id = 1');
            $company = $statement->fetch();
            json_response(200, ['data' => $company ? [$company] : []]);
        }
        $where = $isAdmin ? '' : ' WHERE is_published = 1';
        $orderBy = $resource === 'projects' ? 'id DESC' : 'sort_order ASC, id DESC';
        $statement = $pdo->query("SELECT * FROM {$table}{$where} ORDER BY {$orderBy}");
        json_response(200, ['data' => $statement->fetchAll()]);
    }

    $input = request_json();
    if ($method === 'POST' || $method === 'PATCH') {
        $values = [];
        foreach ($columns as $column) {
            if (array_key_exists($column, $input)) {
                $value = $input[$column];
                $values[$column] = $column === 'is_published'
                    ? (filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 1 : 0)
                    : ($value === null ? null : trim((string) $value));
            } elseif ($method === 'POST' && $column === 'is_published') {
                $values[$column] = $resource === 'clients' ? 0 : 1;
            }
        }

        if ($resource === 'company') {
            foreach (['facebook_url', 'youtube_url', 'twitter_url', 'linkedin_url', 'instagram_url'] as $socialUrlField) {
                if (isset($values[$socialUrlField]) && $values[$socialUrlField] !== '' && !is_valid_http_url($values[$socialUrlField])) {
                    json_response(422, ['error' => 'Social media links must use a valid HTTP or HTTPS URL.']);
                }
            }
        }

        foreach ($definition['required'] as $required) {
            $candidate = $values[$required] ?? ($method === 'PATCH' ? $input[$required] ?? null : null);
            if (!is_string($candidate) || trim($candidate) === '') {
                json_response(422, ['error' => 'Complete all required content fields.']);
            }
        }

        if (isset($values['image']) && $values['image'] !== '' && !is_valid_image_reference($resource, $values['image'])) {
            json_response(422, ['error' => 'Image must be a valid public URL.']);
        }

        if ($method === 'POST' && $resource === 'company') {
            json_response(405, ['error' => 'Company profile is a single managed record.']);
        }

        if ($method === 'POST') {
            $placeholders = implode(', ', array_fill(0, count($values), '?'));
            $names = implode(', ', array_map(static fn(string $column): string => "`{$column}`", array_keys($values)));
            $statement = $pdo->prepare("INSERT INTO {$table} ({$names}) VALUES ({$placeholders})");
            $statement->execute(array_values($values));
            $id = (int) $pdo->lastInsertId();
            $created = $pdo->prepare("SELECT * FROM {$table} WHERE id = ?");
            $created->execute([$id]);
            json_response(201, ['data' => $created->fetch()]);
        }

        $id = $resource === 'company' ? 1 : filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
        if (!$id) {
            json_response(422, ['error' => 'A valid record ID is required.']);
        }
        if (!$values) {
            json_response(422, ['error' => 'No editable fields were provided.']);
        }
        $assignments = implode(', ', array_map(static fn(string $column): string => "`{$column}` = ?", array_keys($values)));
        $statement = $pdo->prepare("UPDATE {$table} SET {$assignments} WHERE id = ?");
        $statement->execute([...array_values($values), $id]);
        if ($statement->rowCount() === 0 && !record_exists($pdo, $table, (int) $id)) {
            json_response(404, ['error' => 'Content record not found.']);
        }
        $updated = $pdo->prepare("SELECT * FROM {$table} WHERE id = ?");
        $updated->execute([$id]);
        json_response(200, ['data' => $updated->fetch()]);
    }

    if ($method === 'DELETE') {
        if ($resource === 'company') {
            json_response(405, ['error' => 'The company profile is a single managed record and cannot be deleted.']);
        }
        $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
        if (!$id) {
            json_response(422, ['error' => 'A valid record ID is required.']);
        }
        $statement = $pdo->prepare("DELETE FROM {$table} WHERE id = ?");
        $statement->execute([$id]);
        if ($statement->rowCount() === 0) {
            json_response(404, ['error' => 'Content record not found.']);
        }
        json_response(200, ['data' => ['deleted' => true]]);
    }

    json_response(405, ['error' => 'Method not allowed.']);
}

function is_valid_image_reference(string $resource, string $image): bool
{
    if (
        in_array($resource, ['projects', 'services', 'products', 'clients', 'gallery'], true)
        && preg_match('#^/uploads/' . preg_quote($resource, '#') . '/[a-zA-Z0-9_-]+\.(?:jpg|png|webp)$#D', $image) === 1
    ) {
        return true;
    }

    return is_valid_http_url($image);
}

function is_valid_http_url(string $url): bool
{
    $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
    return in_array($scheme, ['http', 'https'], true)
        && filter_var($url, FILTER_VALIDATE_URL) !== false;
}

function record_exists(PDO $pdo, string $table, int $id): bool
{
    $statement = $pdo->prepare("SELECT id FROM {$table} WHERE id = ?");
    $statement->execute([$id]);
    return $statement->fetchColumn() !== false;
}

function handle_inquiries(string $method): void
{
    $pdo = db();
    if ($method === 'GET') {
        require_admin();
        $statement = $pdo->query('SELECT id, name, organization, email, inquiry_type, message, created_at FROM inquiries ORDER BY created_at DESC LIMIT 300');
        json_response(200, ['data' => $statement->fetchAll()]);
    }

    if ($method !== 'POST') {
        json_response(405, ['error' => 'Method not allowed.']);
    }

    $input = request_json();
    if (!empty($input['website'])) {
        json_response(201, ['data' => ['received' => true]]);
    }

    $name = trim((string) ($input['name'] ?? ''));
    $email = strtolower(trim((string) ($input['email'] ?? '')));
    $message = trim((string) ($input['message'] ?? ''));
    if ($name === '' || strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190 || $message === '' || strlen($message) > 4000) {
        json_response(422, ['error' => 'Enter your name, a valid email address, and a message under 4,000 characters.']);
    }

    $statement = $pdo->prepare(
        'INSERT INTO inquiries (name, organization, email, phone, inquiry_type, subject, message)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $statement->execute([
        $name,
        trim((string) ($input['organization'] ?? '')) ?: null,
        $email,
        trim((string) ($input['phone'] ?? '')) ?: null,
        trim((string) ($input['inquiry_type'] ?? 'General')) ?: 'General',
        trim((string) ($input['subject'] ?? '')) ?: null,
        $message,
    ]);

    json_response(201, ['data' => ['received' => true]]);
}
