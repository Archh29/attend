<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Database configuration
$host = 'localhost';
$dbname = 'it_days';
$username = 'root'; // Update if needed
$password = ''; // Update if needed

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Fetch data for dropdowns
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = [];

    // Fetch full names
    $stmt = $pdo->query('
        SELECT s.student_id, CONCAT(s.fname, " ", COALESCE(s.mname, ""), " ", s.lname) AS fullname, st.year_level_id, st.tribu_id
        FROM students s
        JOIN student_tribu_year_level st ON s.student_id = st.student_id
    ');
    $data['fullnames'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch year levels
    $stmt = $pdo->query('SELECT * FROM year_levels');
    $data['yearLevels'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch tribus
    $stmt = $pdo->query('SELECT * FROM tribus');
    $data['tribus'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
    exit();
}
?>
