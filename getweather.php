<?php

include('config/db.php');
include('config/weatherdata.php');


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "apikey: $apikey"
));

$response = curl_exec($ch);
if ($response === false) {
    echo 'cURL error: ' . curl_error($ch);
} else {

    if (isset($_GET['store']) && $_GET['store'] == 1) {
        $data = json_decode($response);
        $weather_data = [];

        if (isset($data->variables)) {
            $count = 0;
            foreach ($data->variables as $key => $variables) {
                if (isset($variables->data[0])) {
                    $weather_data[$count]['key'] = $key;
                    $weather_data[$count]['value'] = $variables->data[0];
                    $count++;
                }
            }
        }


        // Prepare and execute SQL statement to insert weather data into database
        $stmt = $mysqli->prepare("INSERT INTO weather_data (weather_key, weather_value) VALUES (?, ?)");

        // Check if the SQL statement is prepared successfully
        if ($stmt === false) {
            die("Error preparing SQL statement: " . $mysqli->error);
        }
        $stmt->bind_param("ss", $weather_key, $weather_value);

        foreach ($weather_data as $weather) {
            $weather_key = $weather['key'];
            $weather_value = $weather['value'];
            $stmt->execute();
        }

        // Close statement and database connection
        $stmt->close();
        $mysqli->close();
    } else {
        // Process the response here
        echo $response;
    }
}
