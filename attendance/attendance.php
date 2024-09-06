<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database configuration
$host = 'localhost';
$dbname = 'it_days';
$username = 'root'; // Update if needed
$password = ''; // Update if needed

// Set timezone to Philippine Time
date_default_timezone_set('Asia/Manila');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['studentId']) || !isset($data['action']) || !isset($data['clientTime'])) {
        echo json_encode(['success' => false, 'message' => 'Missing parameters']);
        exit();
    }

    $studentId = $data['studentId'];
    $action = $data['action'];
    $clientTime = $data['clientTime']; // Assume this is in UTC

    try {
        $currentDateStr = (new DateTime($clientTime, new DateTimeZone('UTC')))->format('Y-m-d');
        $checkInTime = new DateTime($clientTime, new DateTimeZone('UTC'));
        $checkInTime->setTimezone(new DateTimeZone('Asia/Manila'));
        $checkInTimeStr = $checkInTime->format('Y-m-d H:i:s');

        // Check attendance record for the student
        $stmt = $pdo->prepare('SELECT * FROM attendance WHERE student_id = ? AND DATE(check_in_time) = ?');
        $stmt->execute([$studentId, $currentDateStr]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($action === 'check-in') {
            if ($record && $record['check_out_time'] === null) {
                echo json_encode(['success' => false, 'message' => 'Already checked in']);
                exit();
            }

            if ($record && $record['check_out_time'] !== null) {
                echo json_encode(['success' => false, 'message' => 'Already checked in and checked out']);
                exit();
            }

            $checkInTimeLimit = (new DateTime($currentDateStr . ' 08:30:00', new DateTimeZone('Asia/Manila')))->format('Y-m-d H:i:s');
            $isLate = $checkInTimeStr > $checkInTimeLimit;

            $stmt = $pdo->prepare('INSERT INTO attendance (student_id, check_in_time, is_late) VALUES (?, ?, ?)');
            $stmt->execute([$studentId, $checkInTimeStr, $isLate]);

            echo json_encode(['success' => true, 'record' => [
                'student_id' => $studentId,
                'check_in_time' => $checkInTimeStr,
                'check_out_time' => null,
                'is_late' => $isLate,
                'is_early' => null,
            ]]);
        } elseif ($action === 'check-out') {
            if (!$record) {
                echo json_encode(['success' => false, 'message' => 'Not checked in']);
                exit();
            }

            if ($record['check_out_time'] !== null) {
                echo json_encode(['success' => false, 'message' => 'Already checked out']);
                exit();
            }

            $checkOutTime = new DateTime($clientTime, new DateTimeZone('UTC'));
            $checkOutTime->setTimezone(new DateTimeZone('Asia/Manila'));
            $checkOutTimeStr = $checkOutTime->format('Y-m-d H:i:s');
            $checkOutTimeLimit = (new DateTime($currentDateStr . ' 16:40:00', new DateTimeZone('Asia/Manila')))->format('Y-m-d H:i:s');
            $isEarly = $checkOutTimeStr < $checkOutTimeLimit;

            $stmt = $pdo->prepare('UPDATE attendance SET check_out_time = ?, is_early = ? WHERE student_id = ? AND DATE(check_in_time) = ? AND check_out_time IS NULL');
            $stmt->execute([$checkOutTimeStr, $isEarly, $studentId, $currentDateStr]);

            echo json_encode(['success' => true, 'record' => [
                'student_id' => $studentId,
                'check_in_time' => $record['check_in_time'],
                'check_out_time' => $checkOutTimeStr,
                'is_late' => $record['is_late'],
                'is_early' => $isEarly,
            ]]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}
?>
