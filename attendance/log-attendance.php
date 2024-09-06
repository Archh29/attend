<?php
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$dbname = 'it_days';
$username = 'root';
$password = '';

try {
    // Establish a new PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Retrieve the JSON input from the request
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validate the input
    if (!isset($data['studentId']) || empty($data['studentId'])) {
        echo json_encode(['success' => false, 'message' => 'No student ID provided']);
        exit;
    }

    // Check if the student exists
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM students WHERE student_id = :student_id');
    $stmt->bindParam(':student_id', $data['studentId']);
    $stmt->execute();
    $studentExists = $stmt->fetchColumn();

    if (!$studentExists) {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
        exit;
    }

    // Insert the attendance record
    $stmt = $pdo->prepare('INSERT INTO attendance (student_id, check_in_time) VALUES (:student_id, NOW())');
    $stmt->bindParam(':student_id', $data['studentId']);
    $success = $stmt->execute();

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Attendance logged']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to log attendance']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
