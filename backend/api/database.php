<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function db(): PDO
{
    static $connection = null;
    if ($connection instanceof PDO) {
        return $connection;
    }

    $host = config_value('DB_HOST', '127.0.0.1');
    $port = config_value('DB_PORT', '3306');
    $name = config_value('DB_NAME');
    $user = config_value('DB_USER');
    $password = config_value('DB_PASSWORD', '');

    if (!$name || !$user) {
        throw new RuntimeException('Database configuration is incomplete.');
    }

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
    $connection = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $connection;
}
