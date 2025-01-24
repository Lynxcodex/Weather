const apiKey = '49cd7c855dd14056872223859252301'; // Replace with your WeatherAPI key

document.addEventListener("DOMContentLoaded", () => {
  const locationInput = document.getElementById("location-input");
  const searchBtn = document.getElementById("search-btn");
  const currentLocationEl = document.getElementById("current-location");
  const currentDetailsEl = document.getElementById("current-details");
  const forecastDetailsEl = document.getElementById("forecast-details");

  // Get weather for current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    (error) => {
      console.error(error);
      currentLocationEl.textContent = "Unable to fetch location.";
    }
  );

  // Search button click event
  searchBtn.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if (location) {
      fetchWeatherByLocation(location);
    }
  });

  // Fetch weather by coordinates
  async function fetchWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`
      );
      const data = await response.json();
      updateWeatherUI(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch weather by location
  async function fetchWeatherByLocation(location) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`
      );
      const data = await response.json();
      updateWeatherUI(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Update weather UI
  function updateWeatherUI(data) {
    const { location, current, forecast } = data;

    // Update current weather
    currentLocationEl.textContent = `${location.name}, ${location.country}`;
    currentDetailsEl.innerHTML = `
      <div class="weather-card">
        <h3>${current.temp_c}°C</h3>
        <img src="https:${current.condition.icon}" alt="${current.condition.text}">
        <p>${current.condition.text}</p>
      </div>
    `;

    // Update forecast
    forecastDetailsEl.innerHTML = forecast.forecastday
      .map(
        (day) => `
        <div class="weather-card">
          <h3>${day.date}</h3>
          <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
          <p>${day.day.avgtemp_c}°C - ${day.day.condition.text}</p>
        </div>
      `
      )
      .join("");
  }
});