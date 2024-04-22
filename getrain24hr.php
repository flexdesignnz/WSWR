<?php

include('config/db.php');


// Prepare SQL statement to select last 24 data entries
$sql = "SELECT avg(weather_value) as weather_value FROM weather_data WHERE created_at >= NOW() - INTERVAL 24 HOUR and weather_key = 'rainfal_01hracc'";

// Execute SQL query
$result = $mysqli->query($sql);

// Check if query execution was successful
if ($result === false) {
    die("Error executing SQL query: " . $mysqli->error);
}
// Check if there are rows returned
if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        $weather_data = round($row["weather_value"],1);
    }
} else {
    echo "No data found in the last 24 entries.";
}

// Close database connection
$mysqli->close();

echo $weather_data;
