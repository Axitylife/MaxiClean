<?php
header("Content-Type: application/json");

$host = 'localhost';
$db   = 'your_db_name';
$user = 'your_user';
$pass = 'your_password';
$dsn  = "pgsql:host=$host;dbname=$db";

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB error']);
    exit;
}

$date = $_GET['date'] ?? '';
if (!$date) {
    echo json_encode([]);
    exit;
}

$dateObj = DateTime::createFromFormat('d.m.Y', $date);
if (!$dateObj) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("SELECT time_selected FROM records WHERE date_selected = :date");
$stmt->execute([':date' => $dateObj->format('Y-m-d')]);

$busyTimes = array_map(function ($row) {
    return substr($row['time_selected'], 0, 5); // Час:Минута
}, $stmt->fetchAll(PDO::FETCH_ASSOC));

echo json_encode($busyTimes);
