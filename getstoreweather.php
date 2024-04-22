<?php

include('config/db.php');


// Prepare SQL statement to select last 24 data entries
$sql = "SELECT weather_key, weather_value FROM weather_data WHERE created_at >= NOW() - INTERVAL 24 HOUR";

// Execute SQL query
$result = $mysqli->query($sql);

// Check if query execution was successful
if ($result === false) {
    die("Error executing SQL query: " . $mysqli->error);
}
$weather_data = [];
// Check if there are rows returned
if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        $weather_data[$row["weather_key"]][] = $row["weather_value"];
    }
} else {
    echo "No data found in the last 24 entries.";
}

// Close database connection
$mysqli->close();

echo $weather_data;
