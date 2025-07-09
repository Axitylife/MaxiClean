<?php
header("Content-Type: application/json");

// Подключение к PostgreSQL
$host = 'localhost';
$db   = 'your_db_name';
$user = 'your_user';
$pass = 'your_password';
$dsn  = "pgsql:host=$host;dbname=$db";

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подключения к БД']);
    exit;
}

// Получение и разбор JSON
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data || !isset($data['date'], $data['time'], $data['name'], $data['phone'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректные данные']);
    exit;
}

$name = $data['name'];
$phone = $data['phone'];
$auto = $data['auto'] ?? '';
$comment = $data['comment'] ?? '';
$services = $data['services'] ?? [];

$date = DateTime::createFromFormat('d.m.Y', $data['date']);
$time = DateTime::createFromFormat('H:i', $data['time']);

if (!$date || !$time) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный формат даты или времени']);
    exit;
}

// Проверка занятости
try {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM records
        WHERE date_selected = :date AND time_selected = :time
    ");
    $stmt->execute([
        ':date' => $date->format('Y-m-d'),
        ':time' => $time->format('H:i:s')
    ]);

    $count = $stmt->fetchColumn();
    if ($count > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['error' => 'Это время уже занято']);
        exit;
    }

    // Вставка новой записи
    $stmt = $pdo->prepare("
        INSERT INTO records (name, phone, auto, services, comment, date_selected, time_selected)
        VALUES (:name, :phone, :auto, :services, :comment, :date, :time)
    ");
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':auto' => $auto,
        ':services' => $services,
        ':comment' => $comment,
        ':date' => $date->format('Y-m-d'),
        ':time' => $time->format('H:i:s')
    ]);

    echo json_encode(['status' => 'ok']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при сохранении данных']);
}
