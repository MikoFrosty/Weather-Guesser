////////// Weather Guesser //////////
//// Created by Brandon Mikowski ////

/*  Roadmap:
    DONE - Disable button while loading
    DONE - Show city name first before asking for guess
    DONE - Change css/html presentation
    PENDING - (may be done, unless weather events are added) Add graphics
    DONE - (added 30 (40 total)) Add more cities -- possibly look into adding cities using an api or some other method
    DONE - Add error handling to api request
    POSTPONED - keep score
    POSTPONED - expand api data for more challenges
    ACTIVE - selection area e.g. North america, asia, africa, global, etc...
    DONE - Decided on showing map - Show live picture of city with current conditions (maybe before guess even)
    ACTIVE - difficulty levels (guess within 10 degrees, 5, or exact)
    DONE - switch to celsius toggle
    DONE - make mobile friendly
    DONE - add Fahrenheit measurement
*/

import FetchWrapper from "./modules/fetchwrapper.js";
import { places } from "./modules/places.js"; // 10 current places, will expand to 100

function weatherGuesser() {
  // Main inputs, forms, buttons, and wrappers
  const weatherForm = document.querySelector("#weather-guesser");
  const newCityButton = document.querySelector("#new-city-button");
  const optionButton = document.querySelector("#option-button");
  const optionsWrapper = document.querySelector("#options-wrapper");
  const submitGuess = document.querySelector("#submit");
  const guess = document.querySelector("#guess");
  // Options
  const optionsForm = {
    temp: {
      form: document.querySelector("#options-temperature-form"),
      setting: true, // true is f, false is c
      display: "℉",
    },
    region: document.querySelector("#options-region-form"),
    difficulty: document.querySelector("#options-difficulty-form"),
  };

  // Retrieve a random location from places.js
  const getLocation = (randomNumber) => {
    return places[randomNumber];
  };

  // For hiding the options screen when trying to interact with other buttons (besides options)
  const closeOptions = () => {
    if (!optionsWrapper.classList.contains("hide")) {
      optionsWrapper.classList.add("hide");
    }
  };

  // Loads the next city and updates all the necessary data
  const loadCity = () => {
    const mapWrapper = document.querySelector("#map-wrapper");
    const currentCity = document.querySelector("#current-city");
    let randomNumber = Math.floor(Math.random() * 40);
    newCityButton.dataset.number = randomNumber;
    //newCityButton.dataset.number = 28; // For testing specific cities
    let [city, country] = getLocation(newCityButton.dataset.number);
    guess.value = "";

    currentCity.textContent = `${city
      .replace(/_/g, " ")
      .replace(",%20cuba", "")}, ${country}`;

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
    document.querySelector("#answer").textContent = "";
    loadCity();
  });

  // Option button and event listeners for various settings
  optionButton.addEventListener("click", () => {
    optionsWrapper.classList.toggle("hide");
  });

  optionsForm.temp.form.addEventListener("change", (event) => {
    optionsForm.temp.setting = !optionsForm.temp.setting;
    optionsForm.temp.display = optionsForm.temp.setting ? "℉" : "℃";
    document.querySelector("#temp-setting").textContent =
      optionsForm.temp.display;
  });
  optionsForm.region.addEventListener("change", (event) => {
    optionsForm.region.dataset.region = event.target.value.toLowerCase();
  });
  optionsForm.difficulty.addEventListener("change", (event) => {
    optionsForm.difficulty.dataset.difficulty =
      event.target.value.toLowerCase();
  });

  // Temp input, api call, and data return
  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();

    submitGuess.setAttribute("disabled", "disabled");
    closeOptions();
    let answer = document.querySelector("#answer");
    answer.textContent = "";
    answer.classList.add("loader");
    let [city, country] = getLocation(newCityButton.dataset.number);

    // User guesses weather in whole integer, value is stored as "userGuess"
    let userGuess = guess.value;

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
          .replace(",%20cuba", "")} is ${optionsForm.temp.setting ? tempF : tempC}${optionsForm.temp.display}.`;
        answer.classList.remove("loader");
        
        const runLogic = temp => {
          userGuess > temp
          ? (answer.textContent = `Too high! ${script}`)
          : userGuess < temp
          ? (answer.textContent = `Too low! ${script}`)
          : (answer.textContent = `YOU WIN! ${script}`);
        }
        
        if (optionsForm.temp.setting) {
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
        submitGuess.removeAttribute("disabled");
      });
  });
  loadCity();
}

weatherGuesser();
