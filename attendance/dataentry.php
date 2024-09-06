<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$host = 'localhost';
$db   = 'dbstudents'; // Change to your database name
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

// Create PDO instance
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read JSON data from input
    $input = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit;
    }

    $fname = $input['fname'];
    $mname = $input['mname'];
    $lname = $input['lname'];
    $studentIdNumber = $input['student_id_number'];
    $contactInformation = $input['contact_information'];
    $qrCode = $input['qr_code'];
    $createdAt = $input['created_at'];

    try {
        // Insert student data into the database
        $stmt = $pdo->prepare("INSERT INTO Students (first_name, middle_name, last_name, student_id_number, contact_information, qr_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fname, $mname, $lname, $studentIdNumber, $contactInformation, $qrCode, $createdAt]);

        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>
