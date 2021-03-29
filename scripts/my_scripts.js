"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // setWeather();
    // fourSquare();
    openTripMap();

});

const openWeatherAPIKey = 'f78c88e708c80a9202ee595627cdd82b';

const fourSquareClientId = 'ROM2SWN2KTAQSZLUD5KTR5I4F42FNQEJTGRGQK2BGX2DRCKP';
const fourSquareClientSecret = 'OGXZYGZPZE3YXMYHU513L2RIFOYETURJYYGAIXTO4TG4PFGM';

const openTripMapKey = '5ae2e3f221c38a28845f05b65370e244b3b310f07de647889ddf591c';

function setWeather() {
    weatherBalloon('Amsterdam', 'weatherAmsterdam');
    weatherBalloon('New York', 'weatherNewYork');
    weatherBalloon('Los Angeles', 'weatherLosAngeles');
    weatherBalloon('Tokyo', 'weatherTokyo');
}


/***
 * Get weather info by city name.
 * @param cityName
 * @param el
 */
function weatherBalloon(cityName, el) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName+ '&appid=' + openWeatherAPIKey)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            if (data.cod !== 200)
                throw new Error(data.message);
            drawWeather(data, el);
        })
        .catch(function(err) {
            alert(err);
        });
}

/***
 * Visualize weather info.
 * @param data
 * @param el
 */
function drawWeather(data, el) {
    var celcius = Math.round(parseFloat(data.main.temp)-273.15);
    var childNodes = document.querySelectorAll('#'+el+'> *');
    childNodes[0].innerHTML = data.name;
    childNodes[1].src = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    childNodes[2].innerHTML = celcius + '&deg;';
    childNodes[3].innerHTML = data.weather[0].main;
}

/***
 * Get weather info from input city.
 */
function getWeatherInfo() {
    var nameValue = document.getElementById("cname").value;
    weatherBalloon(nameValue, 'weatherSearch');
}


function fourSquare() {
    let url = 'https://api.foursquare.com/v2/',
        qString = 'venues/search?near=Paris&categoryId=4d4b7105d754a06374d81259&client_id=' + fourSquareClientId + '&client_secret=' + fourSquareClientSecret + '&v=20210328';

    fetch(url+qString)
        .then(resp => {
            console.log(resp);
        }).catch((error) => {
        alert(error);
    })
}

function openTripMap() {
    let url = 'https://api.opentripmap.com/0.1/en/places/radius',
        qString = '?radius=500&lon=2.3488&lat=48.85341&kinds=restaurants&limit=10&apikey=' + openTripMapKey;

    fetch(url+qString)
        .then(resp => {
            console.log(resp);
        }).catch((error) => {
        alert(error);
    })
}


