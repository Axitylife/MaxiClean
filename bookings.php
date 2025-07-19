<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'maxiclean';
$user = 'postgres';
$pass = 'Maksimka96';
$port = '5432';

$dsn = "pgsql:host=$host;port=$port;dbname=$db;user=$user;password=$pass";

try {
    $pdo = new PDO($dsn);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB error']);
    exit;
}

$stmt = $pdo->query("SELECT selected_date AS date, selected_time AS time FROM clients WHERE is_canceled = FALSE");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
