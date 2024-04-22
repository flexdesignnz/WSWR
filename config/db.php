<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

// Allow credentials (if needed)
header("Access-Control-Allow-Credentials: true");

// Set content type to JSON
header("Content-Type: application/json");


// Connect to MySQL database
$mysqli = new mysqli("localhost", "USERNAME", "PASSWORD", "DATABASE");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
    