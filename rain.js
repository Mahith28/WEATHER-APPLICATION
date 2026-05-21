const API_KEY = "8b8b6831aedb41f0992204230262105";

async function getWeather(query) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        localStorage.setItem('lastCity', query);
        renderRain(data);
    } catch {
        alert("City not found. Please try again.");
    }
}

function renderRain(data) {
    const today = data.forecast.forecastday[0].day;
    document.getElementById("humidity").innerHTML = `${data.current.humidity}%`;
    document.getElementById("precip").innerHTML = `${data.current.precip_mm} mm`;
    document.getElementById("chance").innerHTML = `${today.daily_chance_of_rain}%`;
    
    let totalRain = 0;
    data.forecast.forecastday.forEach(d => totalRain += d.day.totalprecip_mm);
    document.getElementById("total-rain").innerHTML = `${totalRain.toFixed(1)} mm`;
    
    // Hourly rain - without bars
    let hourlyHtml = "";
    for (let i = 0; i < 24; i++) {
        const hour = data.forecast.forecastday[0].hour[i];
        hourlyHtml += `
            <div class="forecast-card">
                <h3>${hour.time.split(" ")[1]}</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 8px 0;">${hour.chance_of_rain}%</p>
                <p style="font-size: 12px; color: #8aa1bc;">${hour.precip_mm} mm</p>
            </div>
        `;
    }
    document.getElementById("hourly-rain").innerHTML = hourlyHtml;
    
    // Daily rain
    let dailyHtml = "";
    data.forecast.forecastday.forEach((day, i) => {
        dailyHtml += `
            <div class="daily-card">
                <div class="daily-left">
                    <span style="font-weight: bold;">${i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 20px; font-weight: bold; color: #3ea6ff;">${day.day.daily_chance_of_rain}%</span>
                    <span style="font-size: 14px; color: #8aa1bc; margin-left: 12px;">${day.day.totalprecip_mm} mm</span>
                </div>
            </div>
        `;
    });
    document.getElementById("daily-rain").innerHTML = dailyHtml;
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
