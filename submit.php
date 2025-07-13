<?php
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

// Создаём строку для записи
$record = "Имя: $name\nТелефон: $phone\nАвто: $auto\nДата: $date\nВремя: $time\nУслуги: $services_str\nКомментарий: $comment\n------------------------\n";

// Запись в файл
file_put_contents('clients.txt', $record, FILE_APPEND | LOCK_EX);

// Ответ клиенту
echo "<h2>Спасибо за запись, $name!</h2>";
echo "<p>Мы свяжемся с вами по номеру: <strong>$phone</strong></p>";
echo "<a href='index.html'>Вернуться на сайт</a>";
$bookingData = [
    'date' => $date,
    'time' => $time
];

$allBookings = file_exists('bookings.json') ? json_decode(file_get_contents('bookings.json'), true) : [];
$allBookings[] = $bookingData;
file_put_contents('bookings.json', json_encode($allBookings, JSON_PRETTY_PRINT));
?>
