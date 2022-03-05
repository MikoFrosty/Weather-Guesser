import FetchWrapperWeather from "./modules/FetchWrapperWeather.js";
import {places} from "./modules/places.js"; // 10 current places, will expand to 100

const weatherForm = document.querySelector("#weather-guesser");

weatherForm.addEventListener("submit", event => {
    event.preventDefault();

    let randomNumber = Math.floor(Math.random()*10);
    let [city, country] = places[randomNumber];

    document.querySelector("h2").textContent = `Current place is ${city.replace('_', ' ')}, ${country}.`;
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
        ? answer.textContent = `Too high! The current weather in ${city} is ${tempF}F.`
        : userGuess < tempF
        ? answer.textContent = `Too low! The current weather in ${city} is ${tempF}F.`
        : answer.textContent = 'YOU WIN! The current weather is: ' + tempF + 'F.'
        })
    .catch(error => console.error(error));
})