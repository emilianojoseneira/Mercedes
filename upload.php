<?php
ini_set('memory_limit', '256M'); // Aumentar el límite de memoria

require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $spreadsheet = IOFactory::load($fileTmpPath);
    $sheet = $spreadsheet->getActiveSheet();
    $data = $sheet->toArray();

    // Actualiza las credenciales de la base de datos
    $conn = new mysqli('localhost', 'root', '', 'excel_data_db'); // Corrected database name
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    // Truncate the table to delete previous data
    $conn->query('TRUNCATE TABLE calculador');

    $stmt = $conn->prepare('INSERT INTO calculador (Est, Código, Codigo_MBA, Descripción, U$S, Bonf) VALUES (?, ?, ?, ?, ?, ?)');
    if (!$stmt) {
        die('Error al preparar la declaración: ' . $conn->error);
    }

    foreach ($data as $row) {
        // Asegúrate de que los valores sean del tipo correcto
        $est = $row[0];
        $codigo = $row[1];
        $codigo_mba = $row[2];
        $descripcion = $row[3];
        $us = is_numeric($row[4]) ? (float)$row[4] : 0;
        $bonf = is_numeric($row[5]) ? (float)$row[5] : 0;

        // Verificar los datos antes de insertarlos
        if ($stmt->bind_param('ssssdd', $est, $codigo, $codigo_mba, $descripcion, $us, $bonf)) {
            if (!$stmt->execute()) {
                echo 'Error al ejecutar la declaración: ' . $stmt->error . '<br>';
            }
        } else {
            echo 'Error al preparar la declaración: ' . $stmt->error . '<br>';
        }
    }

    // Store the multiplier value
    $multiplier = $_POST['multiplier'] ?? 1;
    $stmt = $conn->prepare('INSERT INTO settings (name, value) VALUES ("multiplier", ?) ON DUPLICATE KEY UPDATE value = VALUES(value)');
    $stmt->bind_param('d', $multiplier);
    $stmt->execute();

    $stmt->close();
    $conn->close();

    echo 'Archivo subido y datos insertados correctamente';
} else {
    echo 'Error al subir el archivo: ' . $_FILES['file']['error'];
}
?>