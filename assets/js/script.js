var searchFormEl = document.getElementById("search-form");
var searchInputEl = document.getElementById("search-input");
var dateTodayEl = document.getElementById("today-date");
var apiKey = "311c0892c00fa382bff35cbf6cb91b8d";

searchFormEl.addEventListener("submit", function(event){
    event.preventDefault();
    var searchCity = searchInputEl.value;
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&limit=1&appid=" + apiKey)
        .then(function(geoResponse){
            return geoResponse.json()     
            .then(function(geoData){
                var lat = geoData[0].lat;
                var lon = geoData[0].lon;
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&appid=" + apiKey)
                    .then(function(weatherResponse){
                        return weatherResponse.json()
                        .then(function(weatherData){
                            var date = moment.unix(weatherData.current.dt).format("MM/DD/YYYY");
                            dateTodayEl.textContent = date;
                        })
                    }) 
            })
        })
})