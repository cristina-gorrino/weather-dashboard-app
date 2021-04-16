var searchFormEl = document.getElementById("search-form");
var searchInputEl = document.getElementById("search-input");

var dateTodayEl = document.getElementById("today-date");
var cityNameEl = document.getElementById("city-name");
var currentIconEl = document.getElementById("current-icon");
var currentTempEl = document.getElementById("current-temp");
var currentHumidEl = document.getElementById("current-humidity");
var currentWindEl = document.getElementById("current-wind");
var currentUvEl = document.getElementById("current-uv");

var day1DateEl = document.getElementById("day1-date");
var day1IconEl = document.getElementById("day1-icon");
var day1TempEl = document.getElementById("day1-temp");
var day1HumidEl = document.getElementById("day1-humidity");

var apiKey = "311c0892c00fa382bff35cbf6cb91b8d";

searchFormEl.addEventListener("submit", getWeatherData);

function getWeatherData(event) {
    event.preventDefault();
    var searchCity = searchInputEl.value;
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&limit=1&appid=" + apiKey)
        .then(function(geoResponse){
            return geoResponse.json()     
            .then(function(geoData){
                var lat = geoData[0].lat;
                var lon = geoData[0].lon;
                var cityName = geoData[0].name;
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&appid=" + apiKey + "&units=imperial")
                    .then(function(weatherResponse){
                        return weatherResponse.json()
                        .then(function(weatherData){
                            var todayDate = moment.unix(weatherData.current.dt).format("MM/DD/YYYY");
                            var currentIcon = weatherData.current.weather[0].icon;
                            var currentTemp = weatherData.current.temp;
                            var currentHumid = weatherData.current.humidity;
                            var currentWind = weatherData.current.wind_speed;
                            var currentUV = weatherData.current.uvi;
                            
                            var day1Date = moment.unix(weatherData.daily[1].dt).format("MM/DD/YYYY");
                            var day1Icon = weatherData.daily[1].weather[0].icon;
                            var day1Temp = weatherData.daily[1].temp.day;
                            var day1Humid = weatherData.daily[1].humidity;
                            
                            
                            console.log(geoData);
                            console.log(weatherData);
                            showWeatherSections();
                            displayWeatherData(cityName, todayDate, currentTemp, currentIcon, currentHumid, currentWind, currentUV, day1Date, day1Temp, day1Icon, day1Humid);
                            
                        })
                    }) 
            })
        })
}

function showWeatherSections () {
    // display the today's weather card
    // display the 5 day forecast cards
}

function displayWeatherData (cityName, todayDate, currentTemp, currentIcon, currentHumid, currentWind, currentUV, day1Date, day1Temp, day1Icon, day1Humid) {
    // Take the vars of weather data taken from the api and add them to the UI elements
    cityNameEl.textContent = cityName;
    dateTodayEl.textContent = todayDate;
    currentIconEl.setAttribute("src", "http://openweathermap.org/img/w/"+ currentIcon +".png");
    // TODO improvement: set alt text from weather description
    currentTempEl.textContent = currentTemp;
    currentHumidEl.textContent = currentHumid;
    currentWindEl.textContent = currentWind;
    currentUvEl.textContent = currentUV;
    styleUV(currentUV);
    
    day1DateEl.textContent = day1Date;
    day1IconEl.setAttribute("src","http://openweathermap.org/img/w/"+ day1Icon +".png");
    day1TempEl.textContent = day1Temp;
    day1HumidEl.textContent = day1Humid;

}

function styleUV(currentUV) {
    if (currentUV <= 2){
        // favorable UV index conditions
        currentUvEl.setAttribute("class", "badge bg-success");
    } else if (currentUV >2 && currentUV <= 7) {
        // moderate UV index conditions
        currentUvEl.setAttribute("class", "badge bg-warning");
    } else if (currentUV >=8) {
         // severe UV index conditions
        currentUvEl.setAttribute("class", "badge bg-danger");
    }
    
}

// TODO: error handling, check for bad request and display warning on page?
// TODO: Use col layout to improve spacing and sizing between weather cards
// TODO: use font-awesome to add icon to search form
// TODO: think about adding a better font
// TODO: improvement, use loop to get 5 day forecast values and add them to UI