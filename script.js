'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const displayCountries = (country, className = '') => {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${country.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${country.name}</h3>
      <h4 class="country__region">${country.region}</h4>
      <p class="country__row"><span>👫</span>${(
        country.population / 1000000
      ).toFixed(1)} millions of people</p>
      <p class="country__row"><span>🗣️</span>${country.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${country.currencies[0].name}</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const catchError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

////////////////////////////////////////
// Outdated way of going around async
// const getCountries = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
// console.log(data.languages[0]);
//     displayCountries(data)
// console.log(data);
//   });
// };

// promises on async function
const getCountries = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => response.json())
    .then(data => {
      displayCountries(data[0]);

      const neighbors = data[0].borders[0];
      if (!neighbors) return;
      // console.log(data[0]);

      return fetch(`https://restcountries.com/v2/alpha/${neighbors}`);
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      displayCountries(data, 'neighbour');
    })
    .catch(err => {
      console.error(`${err}🎇🎇`);
      catchError(`something went wrong ${err.message}. Try again`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};
btn.addEventListener('click', function () {
  getCountries('Nigeria');
});
// getCountries('Spain');
// getCountries('italy');
// getCountries('japan');
// geCountries('portugal');
