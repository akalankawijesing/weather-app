const apiKey = "1a20b1e108e1ef3a0dcbe57f5e90385b";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const precipitationElement = document.getElementById("precipitation");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const felTempElement = document.getElementById("felTemp");
const dateElement = document.getElementById("date");

var latitude = null;
var longitude = null;

const x = document.getElementById("location");

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          showPosition(position);
          resolve(position);
        },
        (error) => {
          showError(error);
          reject(error);
        }
      );
     
    }
  });
}

function showPosition(position) {
  console.log(position);

  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  console.log(latitude);
  console.log(longitude);
  //x.innerHTML ="loading..";
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}

async function fetchWeather(location = null, longitude = null, latitude = null) {
  var setData = false;
  var url = null;

  if (location !== null) {
    url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;
    setData = true;
  }

  if (longitude !== null && latitude !== null) {
    console.log("longi lati");
    url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  }

  const response = await fetch(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      locationElement.textContent = data.name;
      temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
      descriptionElement.textContent = data.weather[0].description;
      precipitationElement.textContent = data.rain['1h'];
      humidityElement.textContent = data.main.humidity;
      windElement.textContent = data.wind.speed;
      felTempElement.textContent = data.main.feels_like;
      
      setBackground(data.weather[0].main);
      console.log(data);
      console.log(data.weather[0].main);
      console.log(data.dt / 3600);
      const date = new Date((data.dt) * 1000);
      dateElement.textContent = date;
      console.log(date);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

window.onload = function () {
  getLocation().then((res) => {
    console.log(latitude);
    console.log(longitude);
    fetchWeather(null, longitude, latitude);
  });
};

searchButton.addEventListener("click", () => {
    const location = locationInput.value;
    if (location) {
      fetchWeather(location,null,null);
    }
  });


  function setBackground_container(weather) {
    var body = document.getElementsByClassName('container')[0];
    if (weather == "Rain" || weather=="Thunderstorm") {
        body.style.backgroundImage = "url('img/raindrops-glass.jpg')";
    } else if (weather == "Snow") {
        body.style.backgroundImage = "url('img/fewClouds.jpg')";
    } else if (weather == "Clear") {
        body.style.backgroundImage = "url('img/clearSky.jpg')";
    } else if (weather == "Clouds") {
        body.style.backgroundImage = "url('img/fewClouds.jpg')";
    }
  }


  function setBackground(weather) {
    var body = document.getElementsByTagName('body')[0];
    if (weather == "Rain" || weather=="Thunderstorm") {
        body.style.backgroundImage = "url('img/raindrops-glass.jpg')";
    } else if (weather == "Snow") {
        body.style.backgroundImage = "url('img/fewClouds.jpg')";
    } else if (weather == "Clear") {
        body.style.backgroundImage = "url('img/clearSky.jpg')";
    } else if (weather == "Clouds") {
        body.style.backgroundImage = "url('img/fewClouds.jpg')";
    }
  }
