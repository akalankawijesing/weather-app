const apiKey = "1a20b1e108e1ef3a0dcbe57f5e90385b";
const accuKey="RFDCPjkzOu70uzjAuOvFim4AzFsdMJQn";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiUrlFoCast = "https://api.openweathermap.org/data/2.5/forecast";
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
const suggestionsDiv = document.getElementById('suggestions');

var latitude = null;
var longitude = null;

let debounceTimeout;

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
      /*precipitationElement.textContent = data.rain['1h'];*/
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
      suggestionsDiv.style.display = 'none';
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      suggestionsDiv.style.display = 'none';
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



  // Fetch City Suggestions
  async function fetchCitySuggestions(query) {
    if (!query) {
      document.getElementById('suggestions').innerHTML = '';
      return;
    }
    
    const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    displaySuggestions(data.list);
  }
  
  // Display City Suggestions
  function displaySuggestions(cities) {
    suggestionsDiv.innerHTML = '';
    suggestionsDiv.style.display = 'block';
    if (!cities || cities.length === 0) {
      suggestionsDiv.innerHTML = '<div class="suggestion-item">No results found</div>';
      return;
    }
    
    cities.forEach(city => {
      const suggestion = document.createElement('div');
      suggestion.className = 'suggestion-item';
      suggestion.textContent = `${city.name}, ${city.sys.country}`;
      
      // Add click event to select a city and fetch its weather
      suggestion.addEventListener('click', () => {
        const location = `${city.name}, ${city.sys.country}`;
        document.getElementById('locationInput').value = location;
        suggestionsDiv.innerHTML = ''; // Clear suggestions after selection
        
        // Call fetchWeather function with the selected city name
        fetchWeather(location);
        
      });
  
      suggestionsDiv.appendChild(suggestion);
    });
  }
// Debounce function for reducing API calls
function debounce(func, delay) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
}

// Listen for input changes and fetch suggestions
document.getElementById('locationInput').addEventListener('input', (e) => {
  const query = e.target.value.trim();
  debounce(() => fetchCitySuggestions(query), 300);
});

// Listen for search button click
document.getElementById('searchButton').addEventListener('click', () => {
  const location = document.getElementById('locationInput').value.trim();
  if (location) {
    fetchWeather(location);
  }
});


async function getForecast(){

  var setData = false;
  var url = null;

  if (location !== null) {
    url = `${apiUrlFoCast}?q=${location}&appid=${apiKey}&units=metric`;
    setData = true;
  }

  if (longitude !== null && latitude !== null) {
    console.log("longi lati");
    url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  }

  const response = await fetch(url);
}