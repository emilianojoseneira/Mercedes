
<?php
header('Content-Type: application/json');

// Actualiza las credenciales de la base de datos
$conn = new mysqli('localhost', 'root', '', 'excel_data_db'); // Corrected database name
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$result = $conn->query('SELECT value FROM settings WHERE name = "additional_multiplier"');
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['success' => true, 'additionalMultiplier' => $row['value']]);
} else {
    echo json_encode(['success' => true, 'additionalMultiplier' => 1]); // Default additional multiplier
}

$conn->close();
?>