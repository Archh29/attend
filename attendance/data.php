<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = 'localhost';
$db   = 'it_days';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Handle the API request
    $action = $_GET['action'] ?? '';

    if ($action === 'getYearLevels') {
        // Fetch year levels
        $stmt = $pdo->query('SELECT year_level_id AS id, level AS name FROM year_levels');
        $yearLevels = $stmt->fetchAll();
        echo json_encode($yearLevels);
    } elseif ($action === 'getTribus') {
        // Fetch tribus
        $stmt = $pdo->query('SELECT tribu_id AS id, name FROM tribus');
        $tribus = $stmt->fetchAll();
        echo json_encode($tribus);
    } elseif ($action === 'getAttendance') {
        // Fetch attendance based on year level, tribu, and date
        $yearLevel = $_GET['yearLevel'] ?? null;
        $tribu = $_GET['tribu'] ?? null;
        $date = $_GET['date'] ?? null;  // Get the date from the query parameters

        // Basic query
        $query = '
            SELECT yl.level AS yearLevel, t.name AS tribu, s.fname, s.mname, s.lname,
                   a.check_in_time AS inTime, a.check_out_time AS outTime
            FROM attendance a
            JOIN students s ON a.student_id = s.student_id
            JOIN student_year_level syl ON s.student_id = syl.student_id
            JOIN year_levels yl ON syl.year_level_id = yl.year_level_id
            JOIN student_tribu st ON s.student_id = st.student_id
            JOIN tribus t ON st.tribu_id = t.tribu_id
            WHERE 1 = 1
        ';

        // Add conditions if parameters are provided
        if ($yearLevel) {
            $query .= ' AND yl.level = :yearLevel';
        }
        if ($tribu) {
            $query .= ' AND t.name = :tribu';
        }
        if ($date) {
            $query .= ' AND DATE(a.check_in_time) = :date'; // Filter by specific date
        }

        $stmt = $pdo->prepare($query);

        // Bind parameters if they are set
        if ($yearLevel) {
            $stmt->bindValue(':yearLevel', $yearLevel, PDO::PARAM_STR);
        }
        if ($tribu) {
            $stmt->bindValue(':tribu', $tribu, PDO::PARAM_STR);
        }
        if ($date) {
            $stmt->bindValue(':date', $date, PDO::PARAM_STR); // Bind the date parameter
        }

        $stmt->execute();

        // Fetch the data
        $attendance = $stmt->fetchAll();

        // Group the data by year level
        $groupedData = [];
        foreach ($attendance as $record) {
            $yearLevel = $record['yearLevel'];
            if (!isset($groupedData[$yearLevel])) {
                $groupedData[$yearLevel] = [
                    'yearLevel' => $yearLevel,
                    'students' => []
                ];
            }
            $groupedData[$yearLevel]['students'][] = [
                'name' => "{$record['fname']} {$record['mname']} {$record['lname']}",
                'inTime' => $record['inTime'],
                'outTime' => $record['outTime'],
            ];
        }

        echo json_encode(array_values($groupedData));
    } else {
        // Invalid action
        echo json_encode(['error' => 'Invalid action']);
    }
} catch (PDOException $e) {
    // Output error as JSON
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    // Output error as JSON
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
}
?>
