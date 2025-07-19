<?php
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

// Подтверждение
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['confirm_id'])) {
        $id = (int) $_POST['confirm_id'];
        $pdo->prepare("UPDATE clients SET is_confirmed = TRUE WHERE id = :id")
            ->execute([':id' => $id]);
    }

    if (isset($_POST['cancel_id'])) {
        $id = (int) $_POST['cancel_id'];
        $pdo->prepare("UPDATE clients SET is_canceled = TRUE WHERE id = :id")
            ->execute([':id' => $id]);
    }

    header("Location: admin.php");
    exit;
}

$stmt = $pdo->query("SELECT * FROM clients ORDER BY created_at DESC");
$clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Записи клиентов</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    th { background-color: #f0f0f0; }
    .status-confirmed { color: green; font-weight: bold; }
    .status-unconfirmed { color: red; font-weight: bold; }
    .status-canceled { color: gray; font-weight: bold; }
    form { margin: 0; }
    button { padding: 5px 10px; }
  </style>
</head>
<body>
  <h1>Записи клиентов</h1>

  <?php if (count($clients) === 0): ?>
    <p>Записей нет.</p>
  <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Телефон</th>
          <th>Авто</th>
          <th>Дата</th>
          <th>Время</th>
          <th>Услуги</th>
          <th>Комментарий</th>
          <th>Создано</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($clients as $client): ?>
          <tr>
            <td><?= htmlspecialchars($client['id']) ?></td>
            <td><?= htmlspecialchars($client['name']) ?></td>
            <td><?= htmlspecialchars($client['phone']) ?></td>
            <td><?= htmlspecialchars($client['auto']) ?></td>
            <td><?= htmlspecialchars($client['selected_date']) ?></td>
            <td><?= htmlspecialchars($client['selected_time']) ?></td>
            <td><?= htmlspecialchars($client['services']) ?></td>
            <td><?= nl2br(htmlspecialchars($client['comment'])) ?></td>
            <td><?= htmlspecialchars($client['created_at']) ?></td>
            <td>
              <?php if ($client['is_canceled']): ?>
                <span class="status-canceled">🛑 Отменено</span>
              <?php elseif ($client['is_confirmed']): ?>
                <span class="status-confirmed">✅ Подтверждено</span>
              <?php else: ?>
                <span class="status-unconfirmed">❌ Не подтверждено</span>
              <?php endif; ?>
            </td>
            <td>
              <?php if (!$client['is_canceled']): ?>
                <form method="post" style="display:inline-block;">
                  <?php if (!$client['is_confirmed']): ?>
                    <input type="hidden" name="confirm_id" value="<?= $client['id'] ?>">
                    <button type="submit">Подтвердить</button>
                  <?php endif; ?>
                </form>
                <form method="post" style="display:inline-block;">
                  <input type="hidden" name="cancel_id" value="<?= $client['id'] ?>">
                  <button type="submit" onclick="return confirm('Отменить эту запись?')">Отменить</button>
                </form>
              <?php else: ?>
                <em>—</em>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</body>
</html>
