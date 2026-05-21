const API_KEY = "2e4d358eb42a4ab688b115721261805";

function getUVLabel(uv) {
    if (uv <= 2) return { text: "Low", color: "#2ecc71" };
    if (uv <= 5) return { text: "Moderate", color: "#f1c40f" };
    if (uv <= 7) return { text: "High", color: "#e67e22" };
    if (uv <= 10) return { text: "Very High", color: "#e74c3c" };
    return { text: "Extreme", color: "#9b59b6" };
}

async function getWeather(query) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7&aqi=yes`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        localStorage.setItem('lastCity', query);
        renderUV(data);
    } catch {
        alert("City not found. Please try again.");
    }
}

function renderUV(data) {
    const uv = data.current.uv;
    const uvInfo = getUVLabel(uv);
    document.getElementById("uv-index").innerHTML = uv;
    document.getElementById("uv-level").innerHTML = uvInfo.text;
    document.getElementById("uv-level").style.backgroundColor = uvInfo.color;
    document.getElementById("uv-level").style.color = "#fff";
    
    document.getElementById("sunrise").innerHTML = data.forecast.forecastday[0].astro.sunrise;
    document.getElementById("sunset").innerHTML = data.forecast.forecastday[0].astro.sunset;
    document.getElementById("moon").innerHTML = data.forecast.forecastday[0].astro.moon_phase;
    
    // 7-day UV forecast
    let dailyHtml = "";
    data.forecast.forecastday.forEach((day, i) => {
        const dayUV = day.day.uv;
        const dayInfo = getUVLabel(dayUV);
        let dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        dailyHtml += `
            <div class="daily-card">
                <span style="font-weight: bold;">${dayName}</span>
                <div>
                    <span style="font-size: 18px; font-weight: bold;">UV ${dayUV}</span>
                    <span class="uv-badge" style="background: ${dayInfo.color}; margin-left: 12px;">${dayInfo.text}</span>
                </div>
            </div>
        `;
    });
    document.getElementById("uv-daily").innerHTML = dailyHtml;
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

const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
    getWeather(lastCity);
}