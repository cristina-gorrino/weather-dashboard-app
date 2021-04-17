var searchFormEl = document.getElementById("search-form");
var searchInputEl = document.getElementById("search-input");
var historyContainerEl = document.getElementById("history-button-container");
var ciityHistoryButtons = document.querySelectorAll(".city-history");

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
var historyArr = [];
var fiveDayForecast = []

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
                historyArr.push({"city":cityName, "longitude": lon, "latitude": lat})
                localStorage.setItem("historyArr", JSON.stringify(historyArr));
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&appid=" + apiKey + "&units=imperial")
                    .then(function(weatherResponse){
                        return weatherResponse.json()
                        .then(function(weatherData){
                            var currentWeather = {
                                city: cityName,
                                date: moment.unix(weatherData.current.dt).format("MM/DD/YYYY"),
                                icon: weatherData.current.weather[0].icon,
                                temp: weatherData.current.temp,
                                humidity: weatherData.current.humidity,
                                wind: weatherData.current.wind_speed,
                                uvi: weatherData.current.uvi

                            }
                            
                            for (var i = 1; i < 6; i++) {
                                var forecast = {
                                    day: i,
                                    date: moment.unix(weatherData.daily[i].dt).format("MM/DD/YYYY"),
                                    icon: weatherData.daily[i].weather[0].icon,
                                    temp: weatherData.daily[i].temp.day,
                                    humidity: weatherData.daily[i].humidity
                                }
                                fiveDayForecast.push(forecast);
                            }
                            console.log(fiveDayForecast);

                            
                            
                            console.log(geoData);
                            console.log(weatherData);
                            showWeatherSections();
                            displayWeatherData(currentWeather, fiveDayForecast);
                            
                        })
                    }) 
            })
        })
}

function showWeatherSections () {
    // display the today's weather card
    // display the 5 day forecast cards
}

function displayWeatherData (currentWeather, fiveDayForecast) {
    // Take the vars of weather data taken from the api and add them to the UI elements
    cityNameEl.textContent = currentWeather.city;
    dateTodayEl.textContent = currentWeather.date;
    currentIconEl.setAttribute("src", "http://openweathermap.org/img/w/"+ currentWeather.icon +".png");
    // TODO improvement: set alt text from weather description
    currentTempEl.textContent = currentWeather.temp;
    currentHumidEl.textContent = currentWeather.humidity;
    currentWindEl.textContent = currentWeather.wind;
    currentUvEl.textContent = currentWeather.uvi;
    styleUV(currentWeather.uvi);
    
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
// TODO: use font-awesome to add icon to search form
// TODO: think about adding a better font
// TODO: improvement, use loop to get 5 day forecast values and add them to UI
// TODO: add listener for history buttons that calls search


function makeCityButtons() {
    var storedCityInfo = JSON.parse(localStorage.getItem("historyArr"));

    for (var i = 0; i < storedCityInfo.length; i++){
        var cityButtonEl = document.createElement("button");
        cityButtonEl.setAttribute("type", "button")
        cityButtonEl.setAttribute("class", "city-history btn btn-primary");
        cityButtonEl.textContent = storedCityInfo[i].city;
        historyContainerEl.appendChild(cityButtonEl);
    } 
}

historyContainerEl.addEventListener("click", function(event) {
    var searchCity = event.target.textContent;
    var storedCityInfo = JSON.parse(localStorage.getItem("historyArr"));
    for (var i = 0; i< storedCityInfo.length; i++) {
        if (searchCity === storedCityInfo[i].city) {
            var lat = storedCityInfo[i].latitude;
            var lon = storedCityInfo[i].longitude;
        }
    }
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&appid=" + apiKey + "&units=imperial")
                    .then(function(weatherResponse){
                        return weatherResponse.json()
                        .then(function(weatherData){
                            var currentWeather = {
                                city: cityName,
                                date: moment.unix(weatherData.current.dt).format("MM/DD/YYYY"),
                                icon: weatherData.current.weather[0].icon,
                                temp: weatherData.current.temp,
                                humidity: weatherData.current.humidity,
                                wind: weatherData.current.wind_speed,
                                uvi: weatherData.current.uvi

                            }
                            
                            for (var i = 1; i < 6; i++) {
                                var forecast = {
                                    day: i,
                                    date: moment.unix(weatherData.daily[i].dt).format("MM/DD/YYYY"),
                                    icon: weatherData.daily[i].weather[0].icon,
                                    temp: weatherData.daily[i].temp.day,
                                    humidity: weatherData.daily[i].humidity
                                }
                                fiveDayForecast.push(forecast);
                            }
                            
                            
                            console.log(weatherData);
                            showWeatherSections();
                            displayWeatherData(currentWeather, fiveDayForecast);
                            
                        })
                    }) 
    
})

function init() {
    makeCityButtons();
}
init();