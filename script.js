const time = document.querySelector(".ist-time");
const fullDate = document.querySelector(".day");
const weatherForm = document.querySelector("form");


function displayTime() {
  const monthNames = [
    "Jan", 
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date();
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  const today = date.getDate();
  const day = dayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear() - 2000;

  time.innerText = `${hours}:${minutes} IST`;
  fullDate.innerText = `${day}, ${today} ${month} ${year}`;
}
displayTime();
setInterval(displayTime, 60000);

document.body.style.background =
  "url('images/cloudy.jpg') no-repeat center center fixed";
document.body.style.backgroundSize = "cover";


function displayWeather(event) {
  event.preventDefault();

  const options = { method: "GET", headers: { accept: "application/json" } };
  const apiKey = "JsnIIavMD1H0SQDa84VfmPHv5fdyl3p0";

  const location = document.querySelector("input").value;
  const locationDisplay = document.querySelector(".location");

  const temperatureDisplay = document.querySelector(".temperature-value");
  const errorMessage = document.querySelector(".error-message");

  const tempMax = document.querySelector("#temp-max");
  const tempMin = document.querySelector("#temp-min");
  const humidity = document.querySelector(".humidity-value");
  const cloudy = document.querySelector("#cloudy");
  const wind = document.querySelector("#wind");
  

  fetch(
    `https://api.tomorrow.io/v4/weather/realtime?location=${location.toLowerCase()}&apikey=${apiKey}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      let temperatureValue = Math.trunc(data.data.values.temperature);
      temperatureDisplay.textContent = temperatureValue;
      locationDisplay.textContent = data.location.name.split(" ")[0];
      tempMax.textContent = `${temperatureValue + 3}°C`;
      tempMin.textContent = `${temperatureValue - 4}°C`;

      let humidityValue = data.data.values.humidity;
      humidity.textContent = humidityValue;

      cloudy.textContent = `${(data.data.values.humidity - 7).toFixed(1)}%`;

      wind.textContent = `${data.data.values.windSpeed.toFixed(1)}km/h`;

      changeBackground(temperatureValue, humidityValue);
      
    })
    .catch((error) => {
      console.error(`Error fetching the weather data : ${error}`);
      errorMessage.innerHTML = "Weather data for the specified location is currently unavailable. <br> Please double-check the location and try again."; 
      
      function displayNull(...args) {
        args.forEach(arg => {
          return arg.textContent = "-";
        });
      }
      displayNull(temperatureDisplay, locationDisplay, tempMax, tempMin, humidity, cloudy, wind);
    });

}


function changeBackground(temperature, humidity) {

  if ((humidity >= 30 && humidity < 50) || temperature < 15) {
    document.body.style.background =
      "url('images/snowfall.jpg') no-repeat center center fixed";

  } else if (humidity >= 50 && humidity < 95) {
    document.body.style.background =
      "url('images/rainfall.jpg') no-repeat center center fixed";

  } else if (humidity >= 80 && humidity <= 100 && temperature >= 30) {
    document.body.style.background =
      "url('images/sunny.jpg') no-repeat center center fixed";

  } else {
    document.body.style.background =
      "url('images/cloudy.jpg') no-repeat center center fixed";
  }

  document.body.style.backgroundSize = "cover";
}
weatherForm.addEventListener("submit", displayWeather);