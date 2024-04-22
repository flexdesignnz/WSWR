<?php

// This file generates arrow and styling here for arrows

include('config/db.php');
$get_dates = $_GET['dates'];
$dates = implode("','", $_GET['dates']);
$dates = "'" . $dates . "'";
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
$svg_html = '';
$time_html = '';

if(count($weather_data)){
    foreach($weather_data as $key => $w_data){
        // Here $key defines arrow
        if($key == 0){
            $style = 'style="margin-right: 0px;margin-left: 11px;"';
        }elseif($key == 1){
            $style = 'style="margin-right: 7px;"';
        }elseif($key == 2){
            $style = 'style="margin-left: -12px;"';
        }else{
            $style = 'style="margin-left: -5px;"';
        }
        $date1 = $get_dates[$key];
        $date2 = date('Y-m-d H:i:s',strtotime($date1.'- 8 Hours'));
        $svg_sql = 'SELECT AVG(weather_value) AS weather_value FROM weather_data WHERE created_at BETWEEN "'.$date2.'"  AND "'.$date1.'"  AND weather_key = "presmsl_01mnavg" ';
        $svg_result = $mysqli->query($svg_sql);
        if ($svg_result) {
            $svg_row = $svg_result->fetch_assoc();
            // echo "<pre>";print_r($svg_row);die; 
            if($svg_row['weather_value'] > $w_data){
                $svg_html .= '<img '.$style.' src="https://assets-global.website-files.com/65b2c962c704418940664bfc/6615bee959f201245709444f_small%20pressure_arrow_up_red.svg" loading="lazy" alt="" class="icon-1x1-small">';
            }else{
                $svg_html .= '<img '.$style.' src="https://assets-global.website-files.com/65b2c962c704418940664bfc/6615bee9be9299d7d943c2c5_small_pressure_arrow_blue_down.svg" loading="lazy" alt="" class="icon-1x1-small">';
            }
        }
    }
}
$main_html = ' <div id="w-node-c6002ede-0f50-689c-c71f-6c12fc3df649-14cf0142" class="graph_bottom_wrapper">
                    <div class="is_biometric" style="display: flex !important;gap: 48px;">
                        '.$svg_html.'
                    </div>
                </div>';

$mysqli->close();

echo json_encode($main_html);