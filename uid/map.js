const API_KEY = "2e4d358eb42a4ab688b115721261805";

async function getWeather(query) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=1`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        localStorage.setItem('lastCity', query);
        renderMap(data);
    } catch {
        alert("City not found. Please try again.");
    }
}

function renderMap(data) {
    const lat = data.location.lat;
    const lon = data.location.lon;
    const mapHtml = `
        <iframe 
            src="https://www.google.com/maps?q=${lat},${lon}&z=12&output=embed"
            loading="lazy"
            allowfullscreen>
        </iframe>
    `;
    document.getElementById("map-container").innerHTML = mapHtml;
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