const API_KEY = "8b8b6831aedb41f0992204230262105";
let windUnit = localStorage.getItem('windUnit') || "kmh";

function formatWind(kph) {
    if (windUnit === "mph") return (kph * 0.621371).toFixed(1) + " mph";
    return kph + " km/h";
}

async function getWeather(query) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        localStorage.setItem('lastCity', query);
        renderWind(data);
    } catch {
        alert("City not found. Please try again.");
    }
}

function renderWind(data) {
    document.getElementById("wind-speed").innerHTML = formatWind(data.current.wind_kph);
    document.getElementById("wind-dir").innerHTML = `${data.current.wind_dir} (${data.current.wind_degree}°)`;
    document.getElementById("wind-gust").innerHTML = formatWind(data.current.gust_kph);
    document.getElementById("feelslike").innerHTML = `${data.current.feelslike_c}°C`;
    
    // Hourly wind
    let hourlyHtml = "";
    for (let i = 0; i < 24; i++) {
        const hour = data.forecast.forecastday[0].hour[i];
        hourlyHtml += `
            <div class="forecast-card">
                <h3>${hour.time.split(" ")[1]}</h3>
                <p style="font-size: 20px; font-weight: bold; margin: 8px 0;">${formatWind(hour.wind_kph)}</p>
                <p style="font-size: 12px; color: #8aa1bc;">${hour.wind_dir}</p>
                <p style="font-size: 11px; color: #6b8aae;">Gust: ${formatWind(hour.gust_kph)}</p>
            </div>
        `;
    }
    document.getElementById("hourly-wind").innerHTML = hourlyHtml;
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
                document.getElementById("location-btn").textContent = "📍 Current Location";
                getWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
            },
            () => {
                document.getElementById("location-btn").textContent = "📍 Current Location";
                alert("Location access denied");
            }
        );
    }
});

// Load last searched city on page load
const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
    getWeather(lastCity);
}
