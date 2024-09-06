<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$dsn = 'mysql:host=localhost;dbname=it_days;charset=utf8';
$username = 'root'; // Update with your database username
$password = ''; // Update with your database password

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Handle different actions (GET, POST, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch data for all entities (students, tribus, and year levels)
    $type = $_GET['type'] ?? '';

    if ($type === 'students') {
        // Fetch students with tribu and year level names
        $stmt = $pdo->query("
            SELECT s.*, 
                   COALESCE(t.name, 'N/A') AS tribu_name, 
                   COALESCE(y.level, 'N/A') AS year_level
            FROM students s
            LEFT JOIN student_tribu st ON s.student_id = st.student_id
            LEFT JOIN tribus t ON st.tribu_id = t.tribu_id
            LEFT JOIN student_year_level sy ON s.student_id = sy.student_id
            LEFT JOIN year_levels y ON sy.year_level_id = y.year_level_id
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($type === 'tribus') {
        $stmt = $pdo->query('SELECT * FROM tribus');
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($type === 'yearLevels') {
        $stmt = $pdo->query('SELECT * FROM year_levels');
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo json_encode(['error' => 'Invalid type parameter']);
    }
} elseif ($method === 'DELETE') {
    // Delete data for students, tribus, or year levels
    $id = $_GET['id'] ?? null;
    $type = $_GET['type'] ?? '';

    if ($id && $type) {
        if ($type === 'students') {
            $stmt = $pdo->prepare('DELETE FROM students WHERE student_id = :id');
            $stmt->execute(['id' => $id]);
        } elseif ($type === 'tribus') {
            $stmt = $pdo->prepare('DELETE FROM tribus WHERE tribu_id = :id');
            $stmt->execute(['id' => $id]);
        } elseif ($type === 'yearLevels') {
            $stmt = $pdo->prepare('DELETE FROM year_levels WHERE year_level_id = :id');
            $stmt->execute(['id' => $id]);
        } else {
            echo json_encode(['error' => 'Invalid type parameter']);
            exit();
        }
        echo json_encode(['success' => 'Record deleted successfully']);
    } else {
        echo json_encode(['error' => 'Missing id or type parameter']);
    }
} elseif ($method === 'POST') {
    // Handle creation or update of records
    $type = $_POST['type'] ?? '';

    if ($type === 'students') {
        $fname = $_POST['fname'] ?? '';
        $mname = $_POST['mname'] ?? '';
        $lname = $_POST['lname'] ?? '';
        $contact = $_POST['contact_information'] ?? '';
        $tribuId = $_POST['tribu_id'] ?? null;
        $yearLevelId = $_POST['year_level_id'] ?? null;
        $id = $_POST['id'] ?? null;

        if ($id) {
            // Update existing student
            $stmt = $pdo->prepare('UPDATE students SET fname = ?, mname = ?, lname = ?, contact_information = ? WHERE student_id = ?');
            $stmt->execute([$fname, $mname, $lname, $contact, $id]);

            // Update student_tribu and student_year_level
            if ($tribuId) {
                $stmt = $pdo->prepare('REPLACE INTO student_tribu (student_id, tribu_id) VALUES (?, ?)');
                $stmt->execute([$id, $tribuId]);
            }

            if ($yearLevelId) {
                $stmt = $pdo->prepare('REPLACE INTO student_year_level (student_id, year_level_id) VALUES (?, ?)');
                $stmt->execute([$id, $yearLevelId]);
            }
        } else {
            // Add new student
            $stmt = $pdo->prepare('INSERT INTO students (fname, mname, lname, contact_information) VALUES (?, ?, ?, ?)');
            $stmt->execute([$fname, $mname, $lname, $contact]);
            $id = $pdo->lastInsertId(); // Get the last inserted student ID

            // Add student_tribu and student_year_level entries
            if ($tribuId) {
                $stmt = $pdo->prepare('INSERT INTO student_tribu (student_id, tribu_id) VALUES (?, ?)');
                $stmt->execute([$id, $tribuId]);
            }

            if ($yearLevelId) {
                $stmt = $pdo->prepare('INSERT INTO student_year_level (student_id, year_level_id) VALUES (?, ?)');
                $stmt->execute([$id, $yearLevelId]);
            }
        }
        echo json_encode(['success' => 'Student record saved successfully']);
    } elseif ($type === 'tribus') {
        $name = $_POST['name'] ?? '';
        $id = $_POST['id'] ?? null;

        if ($id) {
            // Update existing tribu
            $stmt = $pdo->prepare('UPDATE tribus SET name = ? WHERE tribu_id = ?');
            $stmt->execute([$name, $id]);
        } else {
            // Add new tribu
            $stmt = $pdo->prepare('INSERT INTO tribus (name) VALUES (?)');
            $stmt->execute([$name]);
        }
        echo json_encode(['success' => 'Tribu record saved successfully']);
    } elseif ($type === 'yearLevels') {
        $level = $_POST['level'] ?? '';
        $id = $_POST['id'] ?? null;

        if ($id) {
            // Update existing year level
            $stmt = $pdo->prepare('UPDATE year_levels SET level = ? WHERE year_level_id = ?');
            $stmt->execute([$level, $id]);
        } else {
            // Add new year level
            $stmt = $pdo->prepare('INSERT INTO year_levels (level) VALUES (?)');
            $stmt->execute([$level]);
        }
        echo json_encode(['success' => 'Year level record saved successfully']);
    } else {
        echo json_encode(['error' => 'Invalid type parameter']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
