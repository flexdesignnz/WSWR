<?php

include('config/db.php');
$dates = implode("','", $_GET['dates']);
$dates = "'" . $dates . "'";
// $sql = "SELECT * FROM weather_data WHERE HOUR(created_at) % 8 = 6 and weather_key = 'presmsl_01mnavg' order by weather_value asc limit 4;";
$sql = "SELECT * 
FROM weather_data 
WHERE DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') IN (".$dates.") 
AND weather_key = 'presmsl_01mnavg' 
ORDER BY FIELD(
    DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00'),".$dates.") limit 4";

// echo "<pre>";print_r($sql);die;
$result = $mysqli->query($sql);

if ($result === false) {
    die("Error executing SQL query: " . $mysqli->error);
}

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $weather_data[] = $row["weather_value"];
    }
} else {
    echo "No data found in the last 24 entries.";
}

$mysqli->close();

echo json_encode($weather_data);