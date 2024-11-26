<?php
header('Content-Type: application/json');

$codigoMBA = $_GET['codigo_mba'];

// Actualiza las credenciales de la base de datos
$conn = new mysqli('localhost', 'root', '', 'excel_data_db'); // Corrected database name
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$stmt = $conn->prepare('SELECT * FROM calculador WHERE Codigo_MBA LIKE ?'); // Use LIKE for partial matches
if (!$stmt) {
    die(json_encode(['success' => false, 'message' => 'Error al preparar la declaración: ' . $conn->error]));
}

$codigoMBAPattern = '%' . $codigoMBA . '%';
$stmt->bind_param('s', $codigoMBAPattern);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode(['success' => true, 'result' => $rows]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontró el Código MBA']);
}

$stmt->close();
$conn->close();
?>