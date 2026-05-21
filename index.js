const API_KEY = "8b8b6831aedb41f0992204230262105";
let weatherData = null;
let tempUnit = "C";
let windUnit = "kmh";

// Load saved settings
if (localStorage.getItem('tempUnit')) tempUnit = localStorage.getItem('tempUnit');
if (localStorage.getItem('windUnit')) windUnit = localStorage.getItem('windUnit');

function formatTemp(celsius) {
    if (tempUnit === "F") return ((celsius * 9/5) + 32).toFixed(1) + "°F";
    return celsius + "°C";
}

function formatWind(kph) {
    if (windUnit === "mph") return (kph * 0.621371).toFixed(1) + " mph";
    return kph + " km/h";
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function getDayLabel(dateStr, idx) {
    if (idx === 0) return "Today";
    if (idx === 1) return "Tomorrow";
    return dayNames[new Date(dateStr).getDay()];
}

async function getWeather(query) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7&aqi=yes`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        weatherData = data;
        localStorage.setItem('lastCity', query);
        renderHome(data);
    } catch {
        alert("City not found. Please try again.");
    }
}

function renderHome(data) {
    document.getElementById("city").innerHTML = `${data.location.name}, ${data.location.country}`;
    document.getElementById("temp").innerHTML = formatTemp(data.current.temp_c);
    document.getElementById("weather").innerHTML = data.current.condition.text;
    document.getElementById("humidity").innerHTML = `${data.current.humidity}%`;
    document.getElementById("wind-speed").innerHTML = formatWind(data.current.wind_kph);
    document.getElementById("pressure").innerHTML = `${data.current.pressure_mb} hPa`;
    
    const aqiLabels = ["", "Good", "Moderate", "Unhealthy for Sensitive", "Unhealthy", "Very Unhealthy", "Hazardous"];
    const aqi = data.current.air_quality["us-epa-index"];
    document.getElementById("aqi").innerHTML = aqiLabels[aqi] || "N/A";
    
    const localTime = new Date(data.location.localtime);
    document.getElementById("date-time").innerHTML = `${localTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} — ${localTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    document.getElementById("weather-icon").innerHTML = `<img src="https:${data.current.condition.icon}">`;
    
    // Hourly forecast
    let hourlyHtml = "";
    for (let i = 0; i < 24; i++) {
        const hour = data.forecast.forecastday[0].hour[i];
        hourlyHtml += `
            <div class="forecast-card">
                <h3>${hour.time.split(" ")[1]}</h3>
                <img src="https:${hour.condition.icon}">
                <p style="font-weight:bold">${formatTemp(hour.temp_c)}</p>
                <p style="font-size:12px">${hour.chance_of_rain}% rain</p>
            </div>
        `;
    }
    document.getElementById("hourly-container").innerHTML = hourlyHtml;
    
    // Daily forecast
    let dailyHtml = "";
    data.forecast.forecastday.forEach((day, i) => {
        dailyHtml += `
            <div class="daily-card">
                <div class="daily-left">
                    <img src="https:${day.day.condition.icon}" style="width:36px">
                    <span>${getDayLabel(day.date, i)}</span>
                    <span style="color:#c2d3e6">${day.day.condition.text}</span>
                </div>
                <h3>${formatTemp(day.day.maxtemp_c)} / ${formatTemp(day.day.mintemp_c)}</h3>
            </div>
        `;
    });
    document.getElementById("daily-container").innerHTML = dailyHtml;
}

document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("search-input").value.trim();
    if (city) getWeather(city);
    else alert("Please enter a city name");
});

document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = document.getElementById("search-input").value.trim();
        if (city) getWeather(city);
        else alert("Please enter a city name");
    }
});

document.getElementById("location-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
        document.getElementById("location-btn").textContent = "Loading...";
        navigator.geolocation.getCurrentPosition(
            pos => {
                document.getElementById("location-btn").textContent = "Current Location";
                getWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
            },
            () => {
                document.getElementById("location-btn").textContent = "Current Location";
                alert("Location access denied. Please search manually.");
            }
        );
    } else {
        alert("Geolocation not supported");
    }
});

// Load last searched city on page load
const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
    getWeather(lastCity);
}
