
// OpenWeatherMap API key
const apiKey = '7d5e84b6aa21729e749aaae2775dad95';// Replace with your OpenWeatherMap API key



// Function to fetch weather data based on city
async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    displayLoadingSpinner(true);

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error("City not found.");
        }
        const weatherData = await response.json();
        displayWeather(weatherData);
        getForecast(weatherData.coord.lat, weatherData.coord.lon);
    } catch (error) {
        alert(error.message);
    } finally {
        displayLoadingSpinner(false);
    }
}

async function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            displayLoadingSpinner(true);
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
                );
                if (!response.ok) {
                    throw new Error("Unable to fetch weather for your location.");
                }
                const weatherData = await response.json();
                displayWeather(weatherData);
                getForecast(latitude, longitude);
            } catch (error) {
                alert(error.message);
            } finally {
                displayLoadingSpinner(false);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function getForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
            throw new Error("Unable to fetch forecast data.");
        }
        const forecastData = await response.json();
        displayForecast(forecastData); // Existing 5-day forecast
        displayHourlyForecast(forecastData); // Add this to handle hourly data
    } catch (error) {
        alert(error.message);
    }
}


function displayWeather(data) {
    // Display current weather information
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = `${data.main.temp}°C`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("windSpeed").textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById("pressure").textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById("visibility").textContent = `Visibility: ${data.visibility / 1000} km`;

    // Set weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}.png`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = '';  // Clear previous forecast data

    let displayedDays = new Set();

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) {  // Show one forecast per day (8 entries per day in the API response)
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString("en-US", { weekday: 'short' });

            // Ensure each day is only added once
            if (!displayedDays.has(day)) {
                displayedDays.add(day);

                const forecastCard = document.createElement("div");
                forecastCard.classList.add("forecast-card");

                const temp = `${forecast.main.temp}°C`;
                const description = forecast.weather[0].description;
                
                // Custom images for different weather conditions
                let weatherImage;
                switch (description) {
                    case 'clear sky':
                        weatherImage = '/white-cloud-blue-sky-sea (1).jpg'; // Your custom sunny image
                        break;
                    case 'rain':
                        weatherImage = 'images/rainy.png'; // Your custom rainy image
                        break;
                    case 'clouds':
                        weatherImage = 'images/cloudy.png'; // Your custom cloudy image
                        break;
                    case 'thunderstorm':
                        weatherImage = 'images/stormy.png'; // Your custom stormy image
                        break;
                    case 'snow':
                        weatherImage = 'images/snowy.png'; // Your custom snowy image
                        break;
                    default:
                        weatherImage = 'images/unknown.png'; // Fallback for unknown conditions
                        break;
                }

                forecastCard.innerHTML = `
                    <h4>${day}</h4>
                    <img src="${weatherImage}" alt="${description}" class="forecast-icon"/>
                    <p>${temp}</p>
                    <p>${description}</p>
                `;

                forecastContainer.appendChild(forecastCard);
            }
        }
    });
}



function displayWeather(weatherData) {
    const cityName = document.getElementById("cityName");
    const temperature = document.getElementById("temperature");
    const description = document.getElementById("description");
    const windSpeed = document.getElementById("windSpeed");
    const pressure = document.getElementById("pressure");
    const visibility = document.getElementById("visibility");
    const weatherIcon = document.getElementById("weatherIcon");

    cityName.textContent = weatherData.name;
    temperature.textContent = `${weatherData.main.temp}°C`;
    description.textContent = weatherData.weather[0].description;
    windSpeed.textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;
    pressure.textContent = `Pressure: ${weatherData.main.pressure} hPa`;
    visibility.textContent = `Visibility: ${weatherData.visibility / 1000} km`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
}


// Function to display the forecast without duplicates
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = '';  // Clear any previous forecast data

    // To track the days and avoid duplicates
    let displayedDays = new Set();

    forecastData.list.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: 'short' });

        // Ensure each day is only added once (to avoid duplicates)
        if (!displayedDays.has(day)) {
            displayedDays.add(day);

            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");

            // Forecast data
            const temp = `${forecast.main.temp}°C`;
            const description = forecast.weather[0].description;
            const iconCode = forecast.weather[0].icon;

            forecastCard.innerHTML = `
                <h4>${day}</h4>
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}" class="forecast-icon"/>
                <p>${temp}</p>
                <p>${description}</p>
            `;

            forecastContainer.appendChild(forecastCard);
        }
    });
}




function displayLoadingSpinner(isLoading) {
    const spinner = document.getElementById("loadingSpinner");
    if (isLoading) {
        spinner.style.display = "block";
    } else {
        spinner.style.display = "none";
    }
}
// Function to change the theme
function changeTheme(theme) {
    document.body.className = `${theme}-theme`;
}
// Theme toggle logic
document.getElementById("themeToggle").addEventListener("change", function () {
    const body = document.body;
    if (this.checked) {
        // Enable light theme
        body.style.backgroundColor = "#f5f5f5";
        body.style.color = "#1a1a1a";
        document.getElementById("weatherContainer").style.backgroundColor = "#ffffff";
    } else {
        // Enable dark theme
        body.style.backgroundColor = "#1a1a1a";
        body.style.color = "#f5f5f5";
        document.getElementById("weatherContainer").style.backgroundColor = "#2c2c2c";
    }
});
// Theme toggle logic
document.getElementById("themeToggle").addEventListener("change", function () {
    const body = document.body;
    if (this.checked) {
        // Enable light theme
        body.style.backgroundColor = "#f5f5f5";
        body.style.color = "#1a1a1a";
        document.getElementById("weatherContainer").style.backgroundColor = "#ffffff";
    } else {
        // Enable dark theme
        body.style.backgroundColor = "#1a1a1a";
        body.style.color = "#f5f5f5";
        document.getElementById("weatherContainer").style.backgroundColor = "#2c2c2c";
    }
});
// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
    const body = document.body;

    if (themeToggle.checked) {
        // Light theme
        body.classList.add("light-theme");
        body.classList.remove("dark-theme", "sunset-theme", "blue-theme");
    } else {
        // Dark theme
        body.classList.add("dark-theme");
        body.classList.remove("light-theme", "sunset-theme", "blue-theme");
    }
});



// Function to toggle theme
themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme", "sunset-theme", "blue-theme");
    } else {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme", "sunset-theme", "blue-theme");
    }
});
// Function to display current weather
function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const weatherDetails = `
        <p><strong>City:</strong> ${name}</p>
        <p><strong>Temperature:</strong> ${main.temp}°C</p>
        <p><strong>Feels Like:</strong> ${main.feels_like}°C</p>
        <p><strong>Description:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        <p><strong>Sunrise:</strong> ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p><strong>Sunset:</strong> ${new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
    document.getElementById("currentWeatherDetails").innerHTML = weatherDetails;
}
function displayHourlyForecast(data) {
    const hourlyForecastContainer = document.getElementById("hourlyForecastDetails");
    hourlyForecastContainer.innerHTML = '';  // Clear previous data

    data.list.slice(0, 12).forEach((forecast) => {  // Get first 12 hours
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        const date = new Date(forecast.dt * 1000);
        const time = date.getHours() + ":00"; // Display hour only

        forecastCard.innerHTML = `
            <h4>${time}</h4>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
            <p>${forecast.main.temp}°C</p>
            <p>${forecast.weather[0].description}</p>
        `;

        hourlyForecastContainer.appendChild(forecastCard);
    });
}