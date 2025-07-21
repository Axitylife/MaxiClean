<?php
// Настройки подключения к БД
$host = 'localhost';
$db   = 'maxiclean';
$user = 'postgres';
$pass = 'Maksimka96';
$port = '5432';

$dsn = "pgsql:host=$host;port=$port;dbname=$db;user=$user;password=$pass";

try {
    $pdo = new PDO($dsn);
} catch (PDOException $e) {
    die("Ошибка подключения к БД: " . $e->getMessage());
}

// Получаем данные из формы
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$auto = $_POST['auto'] ?? '';
$comment = $_POST['comment'] ?? '';
$date = $_POST['selected_date'] ?? '';
$time = $_POST['selected_time'] ?? '';

// Услуги
$services = [];
if (isset($_POST['detailing_Wash'])) $services[] = 'Детейлинг-мойка';
if (isset($_POST['polish_body'])) $services[] = 'Полировка кузова';
if (isset($_POST['polish_headlight'])) $services[] = 'Полировка фар';
if (isset($_POST['protective_coating'])) $services[] = 'Защитные покрытия';
if (isset($_POST['detailing_salon'])) $services[] = 'Детейлинг салона';

$services_str = implode(', ', $services);

// SQL-запрос на вставку
$sql = "INSERT INTO clients (name, phone, auto, selected_date, selected_time, services, comment)
        VALUES (:name, :phone, :auto, :selected_date, :selected_time, :services, :comment)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':name' => $name,
    ':phone' => $phone,
    ':auto' => $auto,
    ':selected_date' => $date,
    ':selected_time' => $time,
    ':services' => $services_str,
    ':comment' => $comment,
]);

echo "<h2>Спасибо за запись, $name!</h2>";
echo "<p>Мы свяжемся с вами по номеру: <strong>$phone</strong></p>";
echo "<a href='index.html'>Вернуться на сайт</a>";
?>
