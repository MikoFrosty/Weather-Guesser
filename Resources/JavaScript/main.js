////////// Weather Guesser //////////
//// Created by Brandon Mikowski ////

/*  Roadmap:
    Disable button while loading
    Show city first before asking for guess
    Change css/html presentation
    Add graphics
    Add more cities
    Add error handling to api request
    keep score
    expand api data for more challenges
    selection area e.g. North america, asia, africa, global, etc...
    Show live picture of city with current conditions (maybe before guess even)
    difficulty levels (guess within 10 degrees, 5, or exact)
*/

import FetchWrapperWeather from "./modules/FetchWrapperWeather.js";
import {places} from "./modules/places.js"; // 10 current places, will expand to 100

const weatherForm = document.querySelector("#weather-guesser");
const newCity = document.querySelector("#new-city");

const getLocation = randomNumber => {
    return places[randomNumber];
}

newCity.addEventListener("submit", event => {
    
    event.preventDefault();

    let randomNumber = Math.floor(Math.random()*10);
    newCity.dataset.number = randomNumber;
    let [city, country] = getLocation(newCity.dataset.number)

    document.querySelector("h2").textContent = `Current place is ${city.replace('_', ' ')}, ${country}.`;    
})

weatherForm.addEventListener("submit", event => {
    event.preventDefault();

    let [city, country] = getLocation(newCity.dataset.number)

    let answer = document.querySelector("#answer");

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

    const API = new FetchWrapperWeather("https://weatherdbi.herokuapp.com/data/weather/");

    API.get(city)
    .then(data => {
        let tempF = Math.floor(data.currentConditions.temp.f);
        userGuess > tempF
        ? answer.textContent = `Too high! The current weather in ${city.replace('_', ' ')} is ${tempF}F.`
        : userGuess < tempF
        ? answer.textContent = `Too low! The current weather in ${city.replace('_', ' ')} is ${tempF}F.`
        : answer.textContent = 'YOU WIN! The current weather is: ' + tempF + 'F.'
        })
    .catch(error => console.error(error));
})