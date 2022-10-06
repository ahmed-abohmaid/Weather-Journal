// To get date dynamically
const d = new Date();
const newDate = d.toDateString();
console.log(newDate);

// URL for weather information
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// API key
const apiKey = ",&units=metric&appid={your api key}";

// URL for the server
const server = "http://localhost:8080";

// Start generating data
const generateData = () => {
  // Get Elements Value
  const zip = document.getElementById("zip").value;
  // const cityName = document.querySelector(".city__name").value;
  const feelings = document.getElementById("feelings").value;
  const entryHolder = document.getElementById("box");

  // Start promises
  weatherData(zip).then((data) => {
    // Pull the data
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const gatheredInfo = {
      newDate,
      name,
      icon,
      humidity,
      speed,
      temp: Math.round(temp),
      description,
      feelings,
    };

    postData(server + "/add", gatheredInfo);

    updatingUI();

    entryHolder.style.opacity = "1";
    // Change background dynamically with city name
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  });
};

// Adding the generate listener
document.getElementById("generate").addEventListener("click", generateData);
// Enter Listener
document
.getElementById("zip")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      generateData();
    }
  });
document
.getElementById("feelings")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      generateData();
    }
  });

// gathering data
const weatherData = async (zip) => {
  const res = await fetch(baseURL + zip + apiKey);

  try {
    const data = await res.json();
    // When Error
    if (data.cod != 200) {
      let error = data.message;
      alert(error);
      throw new Error(error);
    }

    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

// Post request for saving data
const postData = async (url = "", gatheredData = {}) => {
  console.log(gatheredData);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(gatheredData),
  });

  try {
    const newData = await res.json();
    return newData;
  } catch (error) {
    console.log(error);
  }
};

// For Updating Elements
const updatingUI = async () => {
  const res = await fetch(server + "/all");

  try {
    const updatedData = await res.json();
    // Start updating
    document.querySelector(".city__name").innerHTML = updatedData.name;
    document.getElementById("date").innerHTML = updatedData.newDate;
    document.getElementById("temp").innerHTML = updatedData.temp + "&deg;C";
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + updatedData.icon + ".png";
    document.getElementById("status__info").innerHTML = updatedData.description;
    document.getElementById("humidity").innerText =
      "Humidity: " + updatedData.humidity + "%";
    document.getElementById("wind").innerHTML =
      "Wind: " + updatedData.speed + "km/h";
    // Check if feelings is empty
    if (document.getElementById("feelings").value === "") {
      document.getElementById("feeling").innerHTML = "Your feelings: Empty";
    } else {
      document.getElementById("feeling").innerHTML =
        "Your feelings: " + updatedData.feelings;
    }
  } catch (error) {
    console.log("error: ", error);
  }
};
