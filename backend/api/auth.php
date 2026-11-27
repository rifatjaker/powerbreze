<?php
declare(strict_types=1);

use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/database.php';

function jwt_secret(): string
{
    $secret = config_value('JWT_SECRET', '');
    if (strlen($secret) < 32 || str_contains($secret, 'replace-with-a-random-secret')) {
        throw new RuntimeException('JWT_SECRET must be configured with a random value of at least 32 characters.');
    }
    return $secret;
}

function login_admin(array $input): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_response(405, ['error' => 'Method not allowed.']);
    }

    $email = strtolower(trim((string) ($input['email'] ?? '')));
    $password = (string) ($input['password'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        json_response(422, ['error' => 'Enter a valid email address and password.']);
    }

    $secret = jwt_secret();
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $attemptKey = hash_hmac('sha256', $ip, $secret);
    $pdo = db();
    $pdo->exec('DELETE FROM login_attempts WHERE updated_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)');

    $attemptQuery = $pdo->prepare('SELECT attempts, locked_until FROM login_attempts WHERE ip_hash = ?');
    $attemptQuery->execute([$attemptKey]);
    $attempt = $attemptQuery->fetch();
    if ($attempt && $attempt['locked_until'] && strtotime($attempt['locked_until'] . ' UTC') > time()) {
        json_response(429, ['error' => 'Too many sign-in attempts. Try again later.']);
    }

    $query = $pdo->prepare('SELECT id, email, password_hash, role, must_change_password, auth_version FROM admins WHERE email = ? AND is_active = 1 LIMIT 1');
    $query->execute([$email]);
    $admin = $query->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        $record = $pdo->prepare(
            'INSERT INTO login_attempts (ip_hash, attempts, locked_until)
             VALUES (?, 1, NULL)
             ON DUPLICATE KEY UPDATE
               attempts = attempts + 1,
               locked_until = IF(attempts >= 4, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE), locked_until)'
        );
        $record->execute([$attemptKey]);
        json_response(401, ['error' => 'Email or password is incorrect.']);
    }

    $pdo->prepare('DELETE FROM login_attempts WHERE ip_hash = ?')->execute([$attemptKey]);
    $now = time();
    $ttl = max(300, min(86400, (int) config_value('JWT_TTL', '3600')));
    $payload = [
        'iss' => config_value('JWT_ISSUER', 'powerbreeze-api'),
        'iat' => $now,
        'nbf' => $now,
        'exp' => $now + $ttl,
        'sub' => (string) $admin['id'],
        'email' => $admin['email'],
        'role' => $admin['role'],
        'ver' => (int) $admin['auth_version'],
        'must_change_password' => (bool) $admin['must_change_password'],
    ];

    $token = JWT::encode($payload, $secret, 'HS256');
    json_response(200, [
        'data' => [
            'token' => $token,
            'expires_in' => $ttl,
            'must_change_password' => (bool) $admin['must_change_password'],
        ],
    ]);
}

function authenticated_admin(bool $allowPasswordChange = false): array
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+([A-Za-z0-9._-]+)$/i', (string) $authorization, $matches)) {
        json_response(401, ['error' => 'Admin authentication is required.']);
    }

    try {
        $claims = JWT::decode($matches[1], new Key(jwt_secret(), 'HS256'));
    } catch (ExpiredException | BeforeValidException) {
        json_response(401, ['error' => 'Your session has expired. Sign in again.']);
    } catch (Throwable) {
        json_response(401, ['error' => 'The authentication token is invalid.']);
    }

    $expectedIssuer = config_value('JWT_ISSUER', 'powerbreeze-api');
    $id = filter_var($claims->sub ?? null, FILTER_VALIDATE_INT);
    if (($claims->iss ?? null) !== $expectedIssuer || ($claims->role ?? null) !== 'admin' || !$id) {
        json_response(401, ['error' => 'The authentication token is invalid.']);
    }

    $query = db()->prepare('SELECT id, email, role, is_active, must_change_password, auth_version FROM admins WHERE id = ? LIMIT 1');
    $query->execute([$id]);
    $admin = $query->fetch();
    if (
        !$admin
        || !(bool) $admin['is_active']
        || $admin['role'] !== 'admin'
        || (int) ($claims->ver ?? -1) !== (int) $admin['auth_version']
    ) {
        json_response(401, ['error' => 'The authentication token is invalid. Sign in again.']);
    }

    $mustChangePassword = (bool) $admin['must_change_password']
        || (bool) ($claims->must_change_password ?? false);
    if ($mustChangePassword && !$allowPasswordChange) {
        json_response(403, [
            'error' => 'Change your password before continuing.',
            'code' => 'PASSWORD_CHANGE_REQUIRED',
        ]);
    }

    return [
        'id' => (int) $admin['id'],
        'email' => (string) $admin['email'],
        'must_change_password' => $mustChangePassword,
        'auth_version' => (int) $admin['auth_version'],
    ];
}

function require_admin(): array
{
    $admin = authenticated_admin();
    return ['id' => $admin['id'], 'email' => $admin['email']];
}

function change_admin_password(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_response(405, ['error' => 'Method not allowed.']);
    }

    $admin = authenticated_admin(true);
    if (!$admin['must_change_password']) {
        json_response(409, ['error' => 'A first-login password change is not required.']);
    }

    $input = request_json();
    $currentPassword = (string) ($input['current_password'] ?? '');
    $newPassword = (string) ($input['new_password'] ?? '');
    if ($currentPassword === '' || strlen($newPassword) < 12 || strlen($newPassword) > 1024) {
        json_response(422, ['error' => 'Enter your current password and a new password of at least 12 characters.']);
    }
    if (hash_equals($currentPassword, $newPassword)) {
        json_response(422, ['error' => 'Choose a new password different from your temporary password.']);
    }

    $pdo = db();
    $query = $pdo->prepare('SELECT password_hash FROM admins WHERE id = ? AND is_active = 1 LIMIT 1');
    $query->execute([$admin['id']]);
    $passwordHash = $query->fetchColumn();
    if (!is_string($passwordHash) || !password_verify($currentPassword, $passwordHash)) {
        json_response(401, ['error' => 'The current password is incorrect.']);
    }

    $update = $pdo->prepare(
        'UPDATE admins
         SET password_hash = ?, must_change_password = 0, auth_version = auth_version + 1
         WHERE id = ? AND auth_version = ? AND must_change_password = 1'
    );
    $update->execute([password_hash($newPassword, PASSWORD_DEFAULT), $admin['id'], $admin['auth_version']]);
    if ($update->rowCount() !== 1) {
        json_response(409, ['error' => 'The admin account changed. Sign in again.']);
    }

    json_response(200, ['data' => ['password_changed' => true, 'sign_in_again' => true]]);
}
