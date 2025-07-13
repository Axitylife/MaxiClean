<?php
header('Content-Type: application/json');
$bookings = file_exists('bookings.json') ? file_get_contents('bookings.json') : '[]';
echo $bookings;
?>
