 let station = 93437;
  let station_alpha = 'NZKLX';
  let apikey = 'l73eb969205f524d898654b734dc6bc219';
  let count = 0;
  let wind_number = 1;
  let animated = 1;

  String.prototype.r = String.prototype.replace;
  let weatherService = new URL('https://api.metservice.com/observations/nz/1-minute/weatherStation/' + station_alpha + '/last/60/minutes?format=cf-json');
  
  
  const minHeight = 100;
  const maxHeight = 600;
  const minSpeed = 1000;
  const maxSpeed = 3000;
  
  
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

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
 function determineRange(number) {
 console.log(number,'number')
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
        return "50.78";
    } else if (62 <= number && number <= 74) {
        return "61.66";
    } else if (75 <= number && number <= 88) {
        return "73.44";
    } else if (89 <= number && number <= 102) {
        return "85.22";
    } else if (103 <= number && number <= 117) {
        return "95.92";
    } else {
        return "95";
    }
}

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
    }; fetch('https://try.readme.io/https://api.webflow.com/v2/collections/65c43605d1f4702114cf0147/items?v=1', options)
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
