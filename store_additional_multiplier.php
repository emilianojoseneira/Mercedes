
<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$additionalMultiplier = $data['additionalMultiplier'];

// Actualiza las credenciales de la base de datos
$conn = new mysqli('localhost', 'root', '', 'excel_data_db'); // Corrected database name
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$stmt = $conn->prepare('INSERT INTO settings (name, value) VALUES ("additional_multiplier", ?) ON DUPLICATE KEY UPDATE value = VALUES(value)');
$stmt->bind_param('d', $additionalMultiplier);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Additional multiplier stored successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to store additional multiplier']);
}

$stmt->close();
$conn->close();
?>