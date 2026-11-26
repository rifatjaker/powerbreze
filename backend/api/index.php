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

    if ($resource === 'auth' && $action === 'me' && $method === 'GET') {
        json_response(200, ['data' => require_admin()]);
    }

    $contentResources = [
        'company' => [
            'table' => 'company_settings',
            'columns' => [
                'company_name', 'tagline', 'founded_year', 'about_intro', 'about_body', 'email',
                'whatsapp_phone', 'office_bd_address', 'office_bd_phone', 'office_local_address',
                'office_local_phone', 'office_ca_address', 'office_ca_phone',
            ],
            'required' => ['company_name', 'tagline', 'founded_year', 'about_intro', 'about_body', 'email', 'whatsapp_phone', 'office_bd_address', 'office_bd_phone'],
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
        $statement = $pdo->query("SELECT * FROM {$table}{$where} ORDER BY sort_order ASC, id DESC");
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
                $values[$column] = 1;
            }
        }

        foreach ($definition['required'] as $required) {
            $candidate = $values[$required] ?? ($method === 'PATCH' ? $input[$required] ?? null : null);
            if (!is_string($candidate) || trim($candidate) === '') {
                json_response(422, ['error' => 'Complete all required content fields.']);
            }
        }

        if (isset($values['image']) && $values['image'] !== '' && !filter_var($values['image'], FILTER_VALIDATE_URL)) {
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
