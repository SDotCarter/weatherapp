const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let apiKey = "ff8d3a45764252e0d07f039801a48076";
let api;

inputField.addEventListener("keyup", (e) => {
  // If user pressed enter button and input value IS NOT empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    // If browser supports GeoLocation API
    navigator.geolocation.getCurrentPosition(onSuccess, onerror);
    // If the getCurrentPosition() is successful, onSuccess function will call. If an error occurred, onError function will call.
  } else {
    alert("Your Browser Does Not Support Geolocation API");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords; // Getting latitude and longtitude of the user's device from coords object
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  // Getting API response, returning it, parsing JSON data into JS Object
  // Function calls weatherDetails function with passing API as an argument
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    infoTxt.classList.replace("pending", "error");
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // Produces a custom icon according to the API that is returned

    if (id == 800) {
      wIcon.src = "Weather_Icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "Weather_Icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "Weather_Icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "Weather_Icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "Weather_Icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "Weather_Icons/rain.svg";
    }

    // Passes the above value to the HTML
    let totalTemp = Math.floor(temp) * 1.8 + 32;
    let feelsLike = Math.floor(feels_like) * 1.8 + 32;
    wrapper.querySelector(".temp .numb").innerText = Math.floor(totalTemp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feelsLike);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    inputField.value = "";
    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    // Once data is received from the API, "pending message" is hidden and weather shows
  }
}

arrowBack,
  addEventListener("click", () => {
    wrapper.classList.remove("active");
  });
