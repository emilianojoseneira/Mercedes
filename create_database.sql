
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS excel_data_db;
USE excel_data_db;

-- Crear la tabla
CREATE TABLE IF NOT EXISTS excel_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Est VARCHAR(50),
    Codigo VARCHAR(50),
    CodigoMBA VARCHAR(50),
    Descripcion TEXT,
    US DECIMAL(10,2),
    Bonf DECIMAL(10,2),
    Costo DECIMAL(10,2),
    PrecioSinIVA DECIMAL(10,2),
    PrecioConIVA DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);