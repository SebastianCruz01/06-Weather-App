let weather = {                                                                   //weather object
    apiKey:"33caee23efdb3ef77d0b82a982b8f5da",                                    //api key
    fetchWeather: function (city) {                                               //fetch weather function
      fetch(                                                                      //fetching data from api
        "https://api.openweathermap.org/data/2.5/weather?q=" +                    //api url
          city +                                                                  //city name
          "&units=metric&appid=" +                                                //units and api key
          this.apiKey                                                             //api key
      ) 
        .then((response) => {                                                     //response
          if (!response.ok) {                                                     //if response is not ok 
            alert("No weather found.");                                           //alert
            throw new Error("No weather found.");                                 //throw error
          }                                                                       //end if 
          return response.json();                                                 //return response in json format
        })                                                                        //end then
        .then((data) => this.displayWeather(data));                               //display weather
    },                                                                            //end fetch weather function
    displayWeather: function (data) {                                             //display weather function
      const { name } = data;                                                      //destructuring
      const { icon, description } = data.weather[0];                          
      const { temp, humidity } = data.main;     
      const { speed } = data.wind; 
      document.querySelector(".city").innerText = "Weather in " + name;           //displaying data
      document.querySelector(".icon").src =                                       //icon
        "https://openweathermap.org/img/wn/" + icon + ".png";                     //icon
      document.querySelector(".description").innerText = description;             //description
      document.querySelector(".temp").innerText = temp + "°C";                    //temperature
      document.querySelector(".humidity").innerText =                             //humidity
        "Humidity: " + humidity + "%";                                          
      document.querySelector(".wind").innerText =                                 //wind speed
        "Wind speed: " + speed + " km/h";                                        
      document.querySelector(".weather").classList.remove("loading");             //remove loading class
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";              //background image
    },
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);             //search function
    },
  };
  
  document.querySelector(".search button").addEventListener("click", function () { //search button
    weather.search(); 
  });                                                                              //end search button
  
  document                                                                         //search bar
    .querySelector(".search-bar")                                                 
    .addEventListener("keyup", function (event) {                                  //event listener
      if (event.key == "Enter") {                                                  //if enter key is pressed
        weather.search();                                                          //search
      } 
    });
  
  weather.fetchWeather("New York");                                                 //default city
  