const API_KEY = "1012642ce981d2ce5e4f9f1e626951ca";

let currentUnit = "metric";
let currentCity = "";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const unitSwitch = document.getElementById("unitSwitch");

const weatherCard = document.getElementById("weatherCard");
const hourlyContainer = document.getElementById("hourlyContainer");
const weeklyContainer = document.getElementById("weeklyContainer");

searchBtn.addEventListener("click", searchWeather);

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});

unitSwitch.addEventListener("change", () => {
    currentUnit = unitSwitch.checked ? "imperial" : "metric";

    if (currentCity !== "") {
        loadWeather(currentCity);
    }
});

async function searchWeather() {

    const city = cityInput.value.trim();

    if (!city) {
        showMessage("Please enter a city name.");
        return;
    }

    currentCity = city;

    loadWeather(city);

}

async function loadWeather(city) {

    weatherCard.innerHTML = "<p>Loading...</p>";
    weatherCard.classList.add("active");

    hourlyContainer.innerHTML = "";
    weeklyContainer.innerHTML = "";

    try {

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("City not found");
        }

        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(forecastURL);

        const forecastData = await forecastResponse.json();

        displayCurrentWeather(weatherData);

        displayHourlyForecast(forecastData);

        displayWeeklyForecast(forecastData);

    }

    catch (error) {

        showMessage(error.message);

    }

}

function displayCurrentWeather(data) {

    const icon =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const temperature =
        Math.round(data.main.temp);

    const unit =
        currentUnit === "metric" ? "°C" : "°F";

    const wind =
        currentUnit === "metric" ? "m/s" : "mph";

    weatherCard.className = "weather-card active fade";

    weatherCard.innerHTML =

    `
        <h2>${data.name}, ${data.sys.country}</h2>

        <img src="${icon}" alt="Weather Icon">

        <h1>${temperature}${unit}</h1>

        <p><strong>${capitalize(data.weather[0].description)}</strong></p>

        <p>Humidity : ${data.main.humidity}%</p>

        <p>Wind Speed : ${data.wind.speed} ${wind}</p>
    `;

    applyTheme(data);

}

function applyTheme(data) {

    const now = data.dt;

    const sunrise = data.sys.sunrise;

    const sunset = data.sys.sunset;

    if (now >= sunrise && now < sunset) {

        document.body.classList.remove("night");

    }

    else {

        document.body.classList.add("night");

    }

    updateWeatherEffects(data.weather[0].id);

}

function displayHourlyForecast(forecast) {

    hourlyContainer.innerHTML = "";

    const unit =
        currentUnit === "metric" ? "°C" : "°F";

    const nextHours =
        forecast.list.slice(0, 6);

    nextHours.forEach(item => {

        const time =
            formatHour(item.dt_txt);

        const icon =
            `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        const card =
            document.createElement("div");

        card.className = "hour-card fade";

        card.innerHTML =

        `
            <h4>${time}</h4>

            <img src="${icon}" alt="">

            <p>${Math.round(item.main.temp)}${unit}</p>
        `;

        hourlyContainer.appendChild(card);

    });

}

function showMessage(message) {

    weatherCard.className = "weather-card active";

    weatherCard.innerHTML =

    `
        <p>${message}</p>
    `;

}

function capitalize(text) {

    return text
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1))
        .join(" ");

}

function formatHour(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleTimeString([], {

        hour: "numeric",

        minute: "2-digit"

    });

}

/* ===========================
   WEEKLY FORECAST
=========================== */

function displayWeeklyForecast(forecast) {

    weeklyContainer.innerHTML = "";

    const unit =
        currentUnit === "metric" ? "°C" : "°F";

    const groupedDays = {};

    forecast.list.forEach(item => {

        const date = item.dt_txt.split(" ")[0];

        if (!groupedDays[date]) {

            groupedDays[date] = {
                tempMin: item.main.temp_min,
                tempMax: item.main.temp_max,
                icon: item.weather[0].icon,
                day: getDayName(date)
            };

        } else {

            groupedDays[date].tempMin = Math.min(
                groupedDays[date].tempMin,
                item.main.temp_min
            );

            groupedDays[date].tempMax = Math.max(
                groupedDays[date].tempMax,
                item.main.temp_max
            );

        }

    });

    const days = Object.values(groupedDays).slice(0, 7);

    days.forEach(day => {

        const row = document.createElement("div");

        row.className = "day-card fade";

        row.innerHTML = `
            <span class="day-name">${day.day}</span>

            <img src="https://openweathermap.org/img/wn/${day.icon}.png">

            <span class="day-temp">
                ${Math.round(day.tempMax)}${unit}
                /
                ${Math.round(day.tempMin)}${unit}
            </span>
        `;

        weeklyContainer.appendChild(row);

    });

}


/* ===========================
   WEATHER EFFECTS
=========================== */

function updateWeatherEffects(weatherId) {

    clearRain();

    clearSnow();

    if (weatherId >= 200 && weatherId < 600) {

        createRain();

    }

    if (weatherId >= 600 && weatherId < 700) {

        createSnow();

    }

}


/* ===========================
   RAIN
=========================== */

function createRain() {

    const rain =
        document.getElementById("rain");

    for (let i = 0; i < 140; i++) {

        const drop =
            document.createElement("div");

        drop.className = "drop";

        drop.style.left =
            Math.random() * 100 + "%";

        drop.style.animationDuration =
            (0.35 + Math.random() * 0.5) + "s";

        drop.style.animationDelay =
            Math.random() * 2 + "s";

        rain.appendChild(drop);

    }

}

function clearRain() {

    document.getElementById("rain").innerHTML = "";

}


/* ===========================
   SNOW
=========================== */

function createSnow() {

    const snow =
        document.getElementById("snow");

    for (let i = 0; i < 90; i++) {

        const flake =
            document.createElement("div");

        flake.className = "flake";

        const size =
            4 + Math.random() * 8;

        flake.style.width =
            size + "px";

        flake.style.height =
            size + "px";

        flake.style.left =
            Math.random() * 100 + "%";

        flake.style.animationDuration =
            (3 + Math.random() * 4) + "s";

        flake.style.animationDelay =
            Math.random() * 2 + "s";

        snow.appendChild(flake);

    }

}

function clearSnow() {

    document.getElementById("snow").innerHTML = "";

}


/* ===========================
   UTILITIES
=========================== */

function getDayName(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString("en-US", {

        weekday: "long"

    });

}


/* ===========================
   INITIAL STATE
=========================== */

weatherCard.classList.remove("active");

hourlyContainer.innerHTML = "";

weeklyContainer.innerHTML = "";
