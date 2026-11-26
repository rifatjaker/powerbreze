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

    $query = $pdo->prepare('SELECT id, email, password_hash, role FROM admins WHERE email = ? AND is_active = 1 LIMIT 1');
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
    ];

    $token = JWT::encode($payload, $secret, 'HS256');
    json_response(200, ['data' => ['token' => $token, 'expires_in' => $ttl]]);
}

function require_admin(): array
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
    if (($claims->iss ?? null) !== $expectedIssuer || ($claims->role ?? null) !== 'admin' || !isset($claims->sub)) {
        json_response(401, ['error' => 'The authentication token is invalid.']);
    }

    return ['id' => (int) $claims->sub, 'email' => (string) ($claims->email ?? '')];
}
