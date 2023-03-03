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

const getJson = function (url, errorMessage = 'something went wrong') {
  return fetch(`${url}`).then(response => {
    if (!response.ok) throw new Error(`${errorMessage} ${response.status}`);
    return response.json();
  });
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

////// Raw and unfactored code

// const getCountries = function (country) {
// fetch(`https://restcountries.com/v2/name/${country}`)
//   .then(response => {
//     if (!response.ok) throw new Error(`country not found ${response.status}`);
//     return response.json();
//   })
//   .then(data => {
//     displayCountries(data[0]);
//     const neighbors = data[0].borders[0];
//     // console.log(data[0]);
//     return fetch(`https://restcountries.com/v2/alpha/${neighbors}`);
//   })
//   .then(response => {
//     if (!response.ok)
//       throw new Error(`country doesn't have a neighbor ${response.status}`);
//     return response.json();
//   })
//   .then(data => {
//     // console.log(data);
//     displayCountries(data, 'neighbour');
//   })
//   .catch(err => {
//     console.error(`${err}🎇🎇`);
//     catchError(`something went wrong ${err.message}. Try again`);
//   })
//   .finally(() => (countriesContainer.style.opacity = 1));
// };

///////Refactored code

const getCountries = function (country) {
  getJson(`https://restcountries.com/v2/name/${country}`, 'country not found')
    .then(data => {
      displayCountries(data[0]);
      const neighbors = data[0].borders;
      // console.log(data[0].borders);
      console.log(neighbors);

      if (!neighbors) throw new Error('country has no neighbors');

      return getJson(
        `https://restcountries.com/v2/alpha/${neighbors[0]}`,
        `country doesn't have a neighbor`
      );
    })
    .then(data => {
      displayCountries(data, 'neighbour');
    })
    .catch(err => {
      console.error(`${err}🎇🎇`);
      catchError(`something went wrong ${err.message}. Try again `);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', function () {
  getCountries('australia');
});
// getCountries('queryuudcknjkl[p');
// getCountries('italy');
// getCountries('japan');
// geCountries('portugal');
