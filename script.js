

const apiKey = "33caee23efdb3ef77d0b82a982b8f5da";  // Openweather API Key //
var currWeatherDiv = $("#currentWeather")  ;        // Current Weather Info //
var forecastDiv = $("#weatherForecast");            // Five Day Forcast Info //
var citiesArray;                                    // City Array //
$("#submitCity").click(function() {                 //Jquery City search when user clicks search icon
    event.preventDefault();
    let cityName = $("#cityInput").val();
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
});
$("#previousSearch").click(function() {              // Previous Citys show under search 
    let cityName = event.target.value;
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
})

if (localStorage.getItem("localWeatherSearches")) {         // Local Storage functionality //
    citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches")); // Get search history from local storage //
    writeSearchHistory(citiesArray);                      // Write search history to local storage //
} else {
    citiesArray = [];
};
    // Call API for current weather by city name 
function returnCurrentWeather(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${apiKey}`; 

    // Get info from URL When searched
    $.get(queryURL).then(function(response){ 
        // Current Date  
        let currTime = new Date(response.dt*1000);  
        // Displays Weather Icon 
        let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`; 

        // When searched display info on Weather info
        currWeatherDiv.html(`
        <h2>${response.name}, ${response.sys.country} (${currTime.getMonth()+1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
        <p>Temperature: ${response.main.temp}&#176;F</p> 
        <p>Humidity: ${response.main.humidity}%</p> 
        <p>Wind Speed: ${response.wind.speed} mph</p>
        `, returnUVIndex(response.coord))
        createHistoryButton(response.name); // Create history button for searched city
    })
};

    // Call API for weather forcast 
function returnWeatherForecast(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&APPID=6c0ac38b22e3e819b50460a5a899f855`;

    $.get(queryURL).then(function(response){ 
        let forecastInfo = response.list;  // Forcast info
        forecastDiv.empty();               // Empty forcast div
        $.each(forecastInfo, function(i) { // Forcast info
            if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
                return;
            }
           
            let forecastDate = new Date(forecastInfo[i].dt*1000);   // Forcast dates
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`; // Displays Weather Icon 
            // Append data to 5 day forcast when searched 
            forecastDiv.append(`
            <div class="col-md">     
                <div class="card text-white bg-primary"> 
                    <div class="card-body">
                        <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4> 
                        <img src=${weatherIcon} alt="Icon"> 
                        <p>Temp: ${forecastInfo[i].main.temp}&#176;F</p> 
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p> 
                    </div> 
                </div>
            </div>
            `)
        })
    })
};
    // The current UV index is collected at the same time as the current weather
function returnUVIndex(coordinates) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){ 
        let currUVIndex = response.value;
        let uvSeverity = "green";
        let textColour = "white"
        //  the UV Index rating 
        if (currUVIndex >= 11) {
            uvSeverity = "purple";
        } else if (currUVIndex >= 8) {
            uvSeverity = "red";
        } else if (currUVIndex >= 6) {
            uvSeverity = "orange";
            textColour = "black"
        } else if (currUVIndex >= 3) {
            uvSeverity = "yellow";
            textColour = "black"
        }
        currWeatherDiv.append(`<p>UV Index: <span class="text-${textColour} uvPadding" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);
    })
}
    //history of recent searches 
function createHistoryButton(cityName) {
    var citySearch = cityName.trim();
    var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
    if (buttonCheck.length == 1) {
      return;
    }
    if (!citiesArray.includes(cityName)){
        citiesArray.push(cityName);
        localStorage.setItem("localWeatherSearches", JSON.stringify(citiesArray));
    }
    $("#previousSearch").prepend(`
    <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}
function writeSearchHistory(array) {
    $.each(array, function(i) {
        createHistoryButton(array[i]);
    })
}
