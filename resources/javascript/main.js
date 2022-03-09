////////// Weather Guesser //////////
//// Created by Brandon Mikowski ////

/*  Roadmap:
    DONE - Disable button while loading
    DONE - Show city name first before asking for guess
    ACTIVE - Change css/html presentation
    ACTIVE - Add graphics
    Add more cities -- possibly look into adding cities using an api or some other method
    DONE - Add error handling to api request
    keep score
    expand api data for more challenges
    selection area e.g. North america, asia, africa, global, etc...
    Show live picture of city with current conditions (maybe before guess even)
    difficulty levels (guess within 10 degrees, 5, or exact)
    ACTIVE - make mobile friendly
*/

import FetchWrapper from "./modules/fetchwrapper.js";
import { places } from "./modules/places.js"; // 10 current places, will expand to 100

function weatherGuesser() {
  const weatherForm = document.querySelector("#weather-guesser");
  const newCity = document.querySelector("#new-city");
  const submitGuess = document.querySelector("#submit");

  const getLocation = (randomNumber) => {
    return places[randomNumber];
  };

  newCity.addEventListener("submit", (event) => {
    event.preventDefault();

    //document.querySelector("#new-city-submit").value = "New city"; Not used for now
    let randomNumber = Math.floor(Math.random() * 10);
    newCity.dataset.number = randomNumber;
    let [city, country] = getLocation(newCity.dataset.number);

    document.querySelector("#current-city").textContent = `${city.replace(
      "_",
      " "
    )}, ${country}`;
  });

  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();

    submitGuess.setAttribute("disabled", "disabled");
    let answer = document.querySelector("#answer");
    answer.textContent = "";
    answer.classList.add("loader");
    let [city, country] = getLocation(newCity.dataset.number);

    // User guesses weather in whole integer, value is stored as "userGuess"
    let userGuess = document.querySelector("#guess").value;

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
        let script = `The current weather in ${city.replace(
          "_",
          " "
        )} is ${tempF}F.`;
        answer.classList.remove("loader");
        userGuess > tempF
          ? (answer.textContent = `Too high! ${script}`)
          : userGuess < tempF
          ? (answer.textContent = `Too low! ${script}`)
          : (answer.textContent = `YOU WIN! ${script}`);
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
}

weatherGuesser();
