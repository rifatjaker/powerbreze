<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once dirname(__DIR__) . '/api/database.php';

$email = strtolower(trim((string) config_value('ADMIN_EMAIL', '')));
$password = (string) config_value('ADMIN_PASSWORD', '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 12) {
    fwrite(STDERR, "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in the server environment or .env file.\n");
    exit(1);
}

$statement = db()->prepare(
    'INSERT INTO admins (email, password_hash, role, is_active)
     VALUES (?, ?, "admin", 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), is_active = 1'
);
$statement->execute([$email, password_hash($password, PASSWORD_DEFAULT)]);
fwrite(STDOUT, "Administrator account configured for {$email}.\n");
