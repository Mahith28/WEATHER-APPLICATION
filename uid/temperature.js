const API_KEY = "2e4d358eb42a4ab688b115721261805";
let tempUnit = localStorage.getItem('tempUnit') || "C";

function formatTemp(celsius) {
    if (tempUnit === "F") return ((celsius * 9/5) + 32).toFixed(1) + "°F";
    return celsius + "°C";
}

async function getWeather(query) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        localStorage.setItem('lastCity', query);
        renderTemp(data);
    } catch {
        alert("City not found. Please try again.");
    }
}

function renderTemp(data) {
    const today = data.forecast.forecastday[0].day;
    document.getElementById("current-temp").innerHTML = formatTemp(data.current.temp_c);
    document.getElementById("feelslike").innerHTML = formatTemp(data.current.feelslike_c);
    document.getElementById("high-temp").innerHTML = formatTemp(today.maxtemp_c);
    document.getElementById("low-temp").innerHTML = formatTemp(today.mintemp_c);
    
    // Hourly temp
    let hourlyHtml = "";
    for (let i = 0; i < 24; i++) {
        const hour = data.forecast.forecastday[0].hour[i];
        hourlyHtml += `
            <div class="forecast-card">
                <h3>${hour.time.split(" ")[1]}</h3>
                <p style="font-size:1.3rem; font-weight:bold">${formatTemp(hour.temp_c)}</p>
                <p style="font-size:11px">Feels: ${formatTemp(hour.feelslike_c)}</p>
            </div>
        `;
    }
    document.getElementById("hourly-temp").innerHTML = hourlyHtml;
    
    // Daily temp
    let dailyHtml = "";
    data.forecast.forecastday.forEach((day, i) => {
        const minTemp = day.day.mintemp_c;
        const maxTemp = day.day.maxtemp_c;
        let dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        dailyHtml += `
            <div class="daily-card">
                <span style="font-weight: bold;">${dayName}</span>
                <div>
                    <span style="font-size: 18px; font-weight: bold;">${formatTemp(maxTemp)} / ${formatTemp(minTemp)}</span>
                </div>
            </div>
        `;
    });
    document.getElementById("daily-temp").innerHTML = dailyHtml;
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