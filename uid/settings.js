let tempUnit = localStorage.getItem('tempUnit') || "C";
let windUnit = localStorage.getItem('windUnit') || "kmh";

function updateButtons() {
    document.getElementById("btn-celsius").classList.toggle("active", tempUnit === "C");
    document.getElementById("btn-fahrenheit").classList.toggle("active", tempUnit === "F");
    document.getElementById("btn-kmh").classList.toggle("active", windUnit === "kmh");
    document.getElementById("btn-mph").classList.toggle("active", windUnit === "mph");
}

document.getElementById("btn-celsius").addEventListener("click", () => {
    tempUnit = "C";
    localStorage.setItem('tempUnit', 'C');
    updateButtons();
});

document.getElementById("btn-fahrenheit").addEventListener("click", () => {
    tempUnit = "F";
    localStorage.setItem('tempUnit', 'F');
    updateButtons();
});

document.getElementById("btn-kmh").addEventListener("click", () => {
    windUnit = "kmh";
    localStorage.setItem('windUnit', 'kmh');
    updateButtons();
});

document.getElementById("btn-mph").addEventListener("click", () => {
    windUnit = "mph";
    localStorage.setItem('windUnit', 'mph');
    updateButtons();
});

document.getElementById("clear-data").addEventListener("click", () => {
    if (confirm("Clear all saved preferences and cached data?")) {
        localStorage.removeItem('tempUnit');
        localStorage.removeItem('windUnit');
        localStorage.removeItem('lastCity');
        tempUnit = "C";
        windUnit = "kmh";
        updateButtons();
        alert("All data cleared! Refresh pages to apply defaults.");
    }
});

updateButtons();