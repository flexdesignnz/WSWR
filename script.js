
// Initialize variables
let count = 0; // Counter for API calls
let wind_number = 1; // Wind gauge number
let animated = 1; // Animation flag

// Custom replace method for String prototype
String.prototype.r = String.prototype.replace;

// Constants for wind gauge dimensions and speed ranges
const minSpeed = 1000;
const maxSpeed = 3000;

// Function to generate a random number within a range
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// Array of gradient colors representing different wind speeds
const gradientColors = [
    'var(--custom-color-wind--hurricane)',
    'var(--custom-color-wind--violent-storm)',
    'var(--custom-color-wind--storm)',
    'var(--custom-color-wind--strong-gale)',
    'var(--custom-color-wind--gale)',
    'var(--custom-color-wind--near-gale)',
    'var(--custom-color-wind--strong-breeze)',
    'var(--custom-color-wind--fresh-breeze)',
    'var(--custom-color-wind--moderate-breeze)',
    'var(--custom-color-wind--gentle-breeze)',
    'var(--custom-color-wind--light-breeze)',
    'var(--custom-color-wind--light-air)',
    'var(--custom-color-wind--calm)'
];


// Function to determine wind speed range based on a given number
function determineRange(number) {
    // Define wind speed ranges and their corresponding descriptors
    if (0.1 <= number && number < 1) {
        return "3.82";
    } else if (1 <= number && number <= 5) {
        return "5.82";
    } else if (6 <= number && number <= 11) {
        return "9.98";
    } else if (12 <= number && number <= 19) {
        return "16.32";
    } else if (20 <= number && number <= 28) {
        return "23.58";
    } else if (29 <= number && number <= 38) {
        return "31.74";
    } else if (39 <= number && number <= 49) {
        return "40.81";
    } else if (50 <= number && number <= 61) {
        return "75.78";
    } else if (62 <= number && number <= 74) {
        return "80.66";
    } else if (75 <= number && number <= 88) {
        return "85.44";
    } else if (89 <= number && number <= 102) {
        return "90.22";
    } else if (103 <= number && number <= 117) {
        return "95.92";
    } else {
        return "100";
    }
}

// Array to store weather data
let weather = [];

// Retrieve HTML element for wind gauge background
const element = document.getElementById('wind_gauge_bg');

// Set transition properties for the wind gauge background element
element.style.transition = 'height 1s ease-in-out, background-color 1s ease-in-out';
element.style.backgroundImage = 'linear-gradient(to bottom)';

// Function to generate gradient for wind gauge
function generateGradient(count) {
    const angle = Math.floor(getRandom(0, 360));
    const lastGradients = gradientColors.slice(-count);
    const stops = lastGradients.map((color, index) => `${color} ${(index + 1) * (100 / (lastGradients.length - 1))}%`);
    const gradient = `linear-gradient(to bottom, ${stops.join(', ')})`;
    return gradient;
}

// Function to animate wind gauge element
function animateElement(number) {
    const newHeight = determineRange(number);
    const newHeightGuage = parseFloat(newHeight) + 2;
    const speed = Math.floor(getRandom(minSpeed, maxSpeed));
    const gradient = generateGradient(wind_number);
    element.style.position = `absolute`;
    element.style.width = `3.75rem`;
    element.style.height = `${newHeight}%`;
    element.style.backgroundImage = gradient;
    element.style.bottom = `0rem`
    $('.wind_gauge_icon_wrapper').css('position', 'relative').css('bottom', `${newHeightGuage}%`).css('transition', 'height 1s ease-in-out, background-color 1s ease-in-out')
}


// Function to retrieve weather data from API
function getWeather() {
    $.ajax({
        url: "https://wswr.auramatics.com/getweather.php",
        type: 'GET',
        success: function (response, status, xhr) {
            let data = response

            // Retrieve stored weather data from local storage
            let weather = JSON.parse(localStorage.getItem('temp_data'));
            let wind = JSON.parse(localStorage.getItem('wind_data'));

            if (xhr.status >= 200 && xhr.status < 400) {
                $('.api_value').each(function (k, v) {
                    if (count == 0) {
                        var key = $(this).html();
                        if(key == 'rainfal_24hracc'){
                            var value = 0;
                        }else{
                            var value = data.variables[key].data[0];
                        }
                    }else{
                        var key = $(this).attr('data-key');
                        if(key == 'rainfal_24hracc'){
                            var value = 0;
                        }else{
                            var value = data.variables[key].data[0];
                        }
                    }

                    // Process weather data for the first call
                    if (key == 'windspd_01mnavg' || key == 'windgst_10mnmax') { // wind speed & wind gust
                        value = (value * 1.852).toFixed(1)
                        var nvalue = value.toString();
                        var parts = nvalue.split('.')
                        if (parts.length === 2) {
                            value = parts[0];
                        }
                    } else if (key == 'windcw__01mnmax') { // wind direction
                        console.log(value,'windcw__01mnmax')
                        var input = flipWindDirection(value)
                        // input = 360
                        console.log(input,'windcw__01mnmax')
                        // input = value / 11.25;
                        // input = input + .5 | 0;
                        value = calcPoint(value)
                    } else if (key == 'relhumd_01mnavg') { // Humidity
                        var nvalue = value.toString();
                        var parts = nvalue.split('.')
                        if (parts.length === 2) {
                            value = parts[0] + '<span style="font-size: 75%;">.</span><span style="font-size: 65%;">' + parts[1] + '</span>'
                        }
                    } else {
                        var nvalue = value.toString();
                        var parts = nvalue.split('.')
                        if (parts.length === 2) {
                            value = parts[0] + '<span style="font-size: 50%;">.</span><span style="font-size: 65%;">' + parts[1] + '</span>'
                        }
                    }
                    
                    $(this).attr('data-key', key)
                    if(key == 'rainfal_24hracc'){
                        value = getrain24hr()
                        var nvalue = value.toString();
                        var parts = nvalue.split('.')
                        if (parts.length === 2) {
                            value = parts[0] + '<span style="font-size: 50%;">.</span><span style="font-size: 65%;">' + parts[1] + '</span>'
                        }
                        $(this).html(`${value}`).show().fadeOut(250).fadeIn(250);
                    }else if ($(this).data('value') != data.variables[key].data[0]) {
                        $(this).attr('data-value', data.variables[key].data[0])
                        $(this).html(`${value}`).show().fadeOut(250).fadeIn(250);
                    } else {
                        $(this).attr('data-value', data.variables[key].data[0])
                        $(this).html(`${value}`).show()
                    }

                    // Additional processing based on specific keys
                    
                    //Current Temperature
                    if (key == 'airtemp_01mnavg') {
                        var currentTemperature = data.variables[key].data[0];
                        $.each(weather, function (i, val) {
                            if (val.fieldData.tempmin <= data.variables[key].data[0] && val.fieldData.tempmax >= data.variables[key].data[0]) {
                                $('.temperature_label').html(val.fieldData.name).css('color', val.fieldData.tempcolor);
                                if (val.fieldData.svgcode) {
                                    $('.temp_svg').html(val.fieldData.svgcode);
                                } else {
                                    $('.temp_svg').html('');
                                }
                            }
                        })
                        
                        const temperatures = JSON.parse(localStorage.getItem('hourly_temp'));
                         // Calculate average temperature
                        const averageTemperature = calculateAverage(temperatures);
                    
                        // Update arrow based on current and average temperature
                        updateArrow(currentTemperature, averageTemperature, 'arrow_temp');
                    }
                    
                    //Current Wind Speed
                    if (key == 'windspd_01mnavg') {
                        var windspd = data.variables[key].data[0];
                        data.variables[key].data[0] = data.variables[key].data[0] * 1.852
                        $.each(wind, function (i, val) {
                            if (val.fieldData.startrange <= data.variables[key].data[0] && val.fieldData.endrange >= data.variables[key].data[0]) {
                                $('.wind_label').html(val.fieldData.name).css('color', val.fieldData.windcolor);
                                if (val.fieldData.svgcode) {
                                    $('.wind_svg').html(val.fieldData.svgcode).css('color', val.fieldData.windcolor);
                                } else {
                                    $('.wind_svg').html('');
                                }
                                $('.wind_color_data').next().children().css('color', val.fieldData.windcolor)
                                $('.wind_gauge_icon_wrapper').css('background-color', val.fieldData.windcolor)
                                wind_number = wind.length - i;
                                if (animated == 1) {
                                    animateElement(windspd)
                                } else {
                                    setTimeout(() => {
                                        animateElement(windspd);
                                    }, 1000);
                                }
                                animated++;
                            }
                        })
                    }
                    
                    // Max Wind Gust Last 10 min
                    if (key == 'windgst_10mnmax') {
                        var windspd = data.variables[key].data[0]  * 1.852;
                        //windspd = 50
                        $.each(wind, function (i, val) {
                            if (val.fieldData.startrange <= windspd && val.fieldData.endrange >= windspd) {
                                $('.windgst_color_data').next().children().css('color', val.fieldData.windcolor)
                                if (val.fieldData.svgcode) {
                                    $('.windgst_svg').html(val.fieldData.svgcode).css('color', val.fieldData.windcolor);
                                } else {
                                    $('.windgst_svg').html('');
                                }
                            }
                        })

                    }
                    
                    if(key == 'presmsl_01mnavg'){
                        const pressures = JSON.parse(localStorage.getItem('hourly_pressure'));
                        
                        var currentPressure = data.variables[key].data[0];
                        
                        // Calculate average pressure
                        const averagePressure = calculateAverage(pressures);
                    
                        // Update arrow based on current and average temperature
                        updateArrow(currentPressure, averagePressure, 'arrow_pressure');
                    }
                })
                count++;
            }
        }
    })
}

// Call getWeather function initially and at regular intervals
getWeather();
// Run hourly cycle initially
hourlyCycle();

setInterval(getWeather, 60000);

// Function to calculate wind direction based on degree
function calcPoint(degrees) {
    // Define compass directions
    const compassDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

    // Adjust degrees to fall within 0-360 range
    degrees = (degrees + 360) % 360;

    // Calculate the index of the compass direction
    const index = Math.round(degrees / 22.5);

    // Return the compass direction
    return compassDirections[index % 16];
}

// Function to get short name for wind direction
function getShortName(name) {
    return name.replace(/north/g, "N").replace(/east/g, "E").replace(/south/g, "S").replace(/west/g, "W").replace(/by/g, "b").replace(/[\s-]/g, "");
}

// Iterate through each SVG element and insert it dynamically
$(".dynamic_svg").each(function (index) {
    let svgCode = $(this).text();
    $(svgCode).insertAfter($(this));
});

// Function to calculate average temperature
function calculateAverage(temperatures) {
    console.log(temperatures,'avg')
    if(temperatures != null){
        const sum = temperatures.reduce((acc, curr) => acc + parseFloat(curr), 0);
        return parseFloat((sum / temperatures.length).toFixed(1));
    }
    return 0;
}

// Function to determine arrow direction
function determineArrowDirection(currentTemperature, averageTemperature) {
    if (parseFloat(currentTemperature) < parseFloat(averageTemperature)) {
        return "blue"; // Down arrow
    } else if (parseFloat(currentTemperature) > parseFloat(averageTemperature)) {
        return "red"; // Up arrow
    }
}

// Function to update arrow based on current and average temperature
function updateArrow(currentTemperature, averageTemperature,type) {
    const arrowDirection = determineArrowDirection(currentTemperature, averageTemperature);
    // Code to update arrow on the website
    // For example, you might use something like:
    console.log(arrowDirection,type)
    if(arrowDirection == 'blue')
        document.getElementById(type).src = "https://assets-global.website-files.com/65b2c962c704418940664bfc/65c05e464df04aca9fa2becc_pressure_down_blue.svg";
    else if(arrowDirection == 'red')
        document.getElementById(type).src = "https://assets-global.website-files.com/65b2c962c704418940664bfc/65c05e45ac205d3c8263f735_pressure_up_red.svg";
}

// Main function to run every hour
function hourlyCycle() {
    // Assume temperatures is an array containing temperatures for the past hour
    // Fetch temperatures from server or use available data
    
    $.ajax({
        url: "https://wswr.auramatics.com/getstoreweather.php",
        type: 'GET',
        success: function (response, status, xhr) {
            let data = response
            const temperatures = data['airtemp_01mnavg'];
            const pressures = data['presmsl_01mnavg'];
            
            localStorage.setItem('hourly_temp', JSON.stringify(temperatures))
            localStorage.setItem('hourly_pressure', JSON.stringify(pressures))
           
        }
    })
    
    
}

// Immediately Invoked Function Expression (IIFE) to fetch data from Webflow API
(function () {
    const WEBFLOW_SITE_ID = '65b2c962c704418940664bfc';
    const apiToken = '132302f91859c0c5f24df5a77e63169cee07228a296eda242844f801056ab0d7';
    const collectionId = '65c43605d1f4702114cf0148';
    const itemId = '65c43605d1f4702114cf0213';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer 132302f91859c0c5f24df5a77e63169cee07228a296eda242844f801056ab0d7'
        }
    };

    // Fetch data from Webflow API for wind and temperature
    fetch('https://try.readme.io/https://api.webflow.com/v2/collections/65c43605d1f4702114cf0147/items?v=1', options)
        .then(response => response.json())
        .then(response =>
            localStorage.setItem('wind_data', JSON.stringify(response.items))
        )
        .catch(err => console.error(err));

    fetch('https://try.readme.io/https://api.webflow.com/v2/collections/65c54e967bcdf7b7f13b35e6/items', options)
        .then(response => response.json())
        .then(response =>
            localStorage.setItem('temp_data', JSON.stringify(response.items))
        )
        .catch(err => console.error(err));
})();

// Schedule hourly cycle to run every hour
setInterval(getgraphdata, 60 * 60 * 1000); // Run every hour
setInterval(hourlyCycle, 60 * 60 * 1000); // Run every hour

//Get last 24 hr data

function getgraphdata(){
    generateTimeLabels()
    var graph_data = [];
    $.ajax({
    url: "https://wswr.auramatics.com/getgraphdata.php",
    type: 'GET',
    data:{
        dates:generateDateTimeLabels()
    },
        success: function (response, status, xhr) {
            
        console.log(response,'response')
        // var new_data = [];
        // var count = 0
        
        // for (let i = 0; i < response.length; i++) 
        // {
        //     if (i > 0 && response[i] === response[i - 1]) 
        //     {
        //         new_data[count -1] = 'skip';
        //     }else{
        //         new_data[count] = response[i]
        //     }
        //     count++;
        // }
        // console.log(new_data,'new_data')
        // //new_data.reverse();
        // count = 3
        // $('.small_data_trend_wrapper div').each(function(i){
        //     if(new_data[count] == 'skip'){
        //         $(this).html('')
        //     }else{
        //         $(this).html(new_data[count])
        //     }
        //     count--
        // })
          graph_data = response
          plotChart(graph_data)
          getgrapharrow()
        }
    })
}
function getgrapharrow(){
    $.ajax({
        url: "https://wswr.auramatics.com/getgrapharrow.php",
        type: 'GET',
        data:{
            v:"3",
            dates:generateDateTimeLabels(),
        },
        success: function (response, status, xhr) {
            const newElement = document.createElement('div');
            newElement.innerHTML = response;
            const referenceDiv = document.getElementById('pressure_trend_graph');
            referenceDiv.insertAdjacentElement('afterend', newElement);
        }
    })
}
function generateDateTimeLabels() {
    const labels = [];
    const now = new Date();
    now.setDate(now.getDate() - 1);
    // console.log(now)
    let hour = now.getHours();
    
    // Determine the nearest starting hour (6 AM, 2 PM, or 10 PM)
    if (hour >= 6 && hour < 14) {
        hour = 6;
    } else if (hour >= 14 && hour < 22) {
        hour = 14;
    } else if (hour >= 22) {
        hour = 22;
    }

    let currentDate = new Date(now);
    currentDate.setHours(hour);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);

    for (let i = 0; i < 4; i++) {
        // Convert to full date and time in the format Y-m-d H:i:s
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const timeLabel = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        labels.push(timeLabel);
        
        // Increment the current date by 8 hours
        currentDate.setHours(currentDate.getHours() + 8);
    }
    
    return labels;
}

function generateTimeLabels() {
    const labels = [];
    const now = new Date();
    let hour = now.getHours();
    let period = hour >= 12 ? 'pm' : 'am';
    
    console.log(hour,period)
    // Determine the nearest starting hour (6 AM, 2 PM, or 10 PM)
    if (hour >= 6 && hour < 14) {
        hour = 6;
    } else if (hour >= 14 && hour < 22) {
        hour = 14;
    } else if (hour >= 22) {
        hour = 22;
    }
    
    console.log(hour,period)
    for (let i = 0; i < 4; i++) {
        let hour12 = (hour % 12) || 12; // Convert hour to 12-hour format
        let time = `${hour12}${period}`;
        labels.push(time);
        hour = (hour + 8) % 24; // Increment by 8 hours, wrap around at 24 hours
        if (hour >= 12) period = 'pm'; // Update period if hour crosses 12
        else period = 'am';
    }
    
    $('.time_wrapper div').each(function(i){
        $(this).html(labels[i])
    })
    
    return labels;
}

// Presssure Trend Graph
function plotChart(graph_data) {
    var g_data = graph_data;
    var ctx = document.getElementById('pressure_trend_graph').getContext('2d');
    Chart.defaults.color = '#fff';
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(),
            datasets: [{
                label: '',
                data: graph_data.map(parseFloat),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.3,  // Disable bezier curves
                backgroundColor: 'rgba(120,136,170)',
                borderColor: 'rgba(120,136,170)',
                fill: true,
                pointRadius: 0  // Hide points
            }]
        },
        
        options: {
            responsive: true,
            interaction: {
              intersect: false,
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: true, // Hide x-axis
                    grid: {
                        display: false, // Remove gridlines
                    },
                },
                y: {
                    ticks: {
                        stepSize: 5,
                    },
                    position: 'right', // Display y-axis on the right
                    display: true,  // Hide x-axis
                    grid: {
                        display: false, // Remove gridlines' 
                    }
                }
            },
            bezierCurve : false
        }
    });
    
    
}

function flipWindDirection(degree) {
    // Add 180 degrees and take modulus by 360
    return (degree + 180) % 360;
}

function rain_ajax(){
    
}

var data = 0;
function getrain24hr(){
    var rain =  $.ajax({
        url: "https://wswr.auramatics.com/getrain24hr.php",
        type: 'GET',
        async: false,
        success: function (response) {
           data = response;
        },
        error: function (error) {
            reject(error);
        }
    });
    console.log(data,'getrain24hr')
    return data;
}

getgraphdata()



