////////// Weather Guesser //////////
//// Created by Brandon Mikowski ////

import FetchWrapper from "./modules/fetchwrapper.js";
import { places } from "./modules/places.js"; // 10 current places, will expand to 100
//let counter = 26; // For testing

function weatherGuesser() {
  // Main button, form, and input
  const newCityButton = document.querySelector("#new-city-button"),
    weatherForm = document.querySelector("#weather-guesser"),
    guessInput = document.querySelector("#guess");

  // Options
  const options = {
    button: document.querySelector("#option-button"),
    wrapper: document.querySelector("#options-wrapper"),
    temp: {
      form: document.querySelector("#options-temperature-form"),
      setting: 1, // 1 - f, 0 - c
      display: "℉",
    },
    region: {
      form: document.querySelector("#options-region-form"),
      setting: 0, // 0 - Global, 1 - North America, 2 - Europe, 3 - Asia
    },
    difficulty: {
      form: document.querySelector("#options-difficulty-form"),
      setting: 0, // 0 - Easy, 1 - Medium, 2 - Hard
    },
  };

  // Retrieve a random location from places.js
  const getPlaces = () => {
    switch (options.region.setting) {
      case 0:
        return places;
      case 1:
        return places.filter((city) => city[3] === "North America");
      case 2:
        return places.filter((city) => city[3] === "Europe");
      case 3:
        return places.filter((city) => city[3] === "Asia");
    }
  };

  // For hiding the options screen when trying to interact with other buttons (besides options)
  const closeOptions = () => {
    if (!options.wrapper.classList.contains("hide")) {
      options.wrapper.classList.add("hide");
    }
  };

  // Loads the next city and updates all the necessary data
  const loadCity = () => {
    const mapWrapper = document.querySelector("#map-wrapper");
    const currentCity = document.querySelector("#current-city");
    const placesList = getPlaces();
    newCityButton.dataset.number = Math.floor(
      Math.random() * placesList.length
    );
    //newCityButton.dataset.number = counter++; // For testing specific cities
    let [city, country] = placesList[newCityButton.dataset.number];
    guessInput.value = "";

    currentCity.textContent = `${city
      .replace(/_/g, " ")
      .replace(/[,]%20\w+/, "")}, ${country}`;

    // Load new map iframe for new city
    mapWrapper.innerHTML = `
            <iframe
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=${city}&t=k&z=3&ie=UTF8&iwloc=&output=embed"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
            ></iframe>
            `;
    closeOptions();
  };

  newCityButton.addEventListener("click", () => {
    const currentWeather = document.querySelector("#current-weather");
    document.querySelector("#answer").textContent = "";
    currentWeather.innerHTML = "";
    currentWeather.style.borderTop = "none";
    loadCity();
  });

  // Option button and event listeners for various settings
  options.button.addEventListener("click", () => {
    options.wrapper.classList.toggle("hide");
  });

  options.temp.form.addEventListener("change", (event) => {
    options.temp.setting = Number.parseInt(event.target.value, 10);
    options.temp.display = options.temp.setting ? "℉" : "℃";
    document.querySelector("#temp-setting").textContent = options.temp.display;
  });
  options.region.form.addEventListener("change", (event) => {
    options.region.setting = Number.parseInt(event.target.value, 10);
  });
  options.difficulty.form.addEventListener("change", (event) => {
    options.difficulty.setting = Number.parseInt(event.target.value, 10);
    const winCondition = document.querySelector("#win-condition");
    switch (options.difficulty.setting) {
      case 0:
        winCondition.textContent = "within 10°";
        break;
      case 1:
        winCondition.textContent = "within 5°";
        break;
      case 2:
        winCondition.textContent = "an exact match";
        break;
    }
  });

  // Temp input, api call, and data return
  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const guessButton = document.querySelector("#submit");
    guessButton.setAttribute("disabled", "disabled");
    closeOptions();
    let answer = document.querySelector("#answer");
    answer.textContent = "";
    answer.classList.add("loader");
    let [city, country] = getPlaces()[newCityButton.dataset.number];

    // User guesses weather in whole integer, value is stored as "userGuess"
    let userGuess = guessInput.value;

    let h1 = document.querySelector("h1");
    h1.removeAttribute("id");
    console.log(h1.hasAttribute("id"));
    h1.setAttribute("id", "newid");
    console.log(h1.hasAttribute("id"));
    let attribute = h1.getAttribute("id");
    console.log(attribute);

    // Weater API is https://weatherdbi.herokuapp.com/documentation/v1
    // Base URL is: https://weatherdbi.herokuapp.com/data/weather/
    // Use city name for endpoint

    const API = new FetchWrapper(
      "https://weatherdbi.herokuapp.com/data/weather/"
    );

    API.get(city)
      .then((data) => {
        let tempF = Math.floor(data.currentConditions.temp.f);
        let tempC = Math.floor(data.currentConditions.temp.c);
        let script = `The current temp in ${city
          .replace(/_/g, " ")
          .replace(/[,]%20\w+/, "")}, ${country} is ${
          options.temp.setting ? tempF : tempC
        }${options.temp.display}.`;
        answer.classList.remove("loader");

        const runLogic = (temp) => {
          const tempRange = () => {
            switch (options.difficulty.setting) {
              case 0:
                return 10;
              case 1:
                return 5;
              case 2:
                return 0;
            }
          };
          let difficulty = tempRange();
          if (userGuess > temp + difficulty) {
            answer.innerHTML = `<span class="loseh-text">Too high!</span> ${script}`;
          } else if (userGuess < temp - difficulty) {
            answer.innerHTML = `<span class="losel-text">Too low!</span> ${script}`;
          } else {
            answer.innerHTML = `<span class="win-text">YOU WIN!</span> ${script}`;
          }
          const currentWeather = document.querySelector("#current-weather");
          currentWeather.innerHTML = `
              <p>Current weather: ${data.currentConditions.comment}</p>
              <img src="${data.currentConditions.iconURL}">
          `;
          currentWeather.style.borderTop = "1px solid black";
        };

        if (options.temp.setting) {
          runLogic(tempF);
        } else {
          runLogic(tempC);
        }
      })
      .catch((error) => {
        console.error(error);
        answer.classList.remove("loader");
        answer.textContent = "The weather is unavailable right now :/";
      })
      .finally(() => {
        guessButton.removeAttribute("disabled");
      });
  });
  loadCity();
}

weatherGuesser();
