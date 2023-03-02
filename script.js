'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const displayCountries = country => {
  const html = `
  <article class="country">
    <img class="country__img" src="${country.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${country.name.common}</h3>
      <h4 class="country__region">${country.region}</h4>
      <p class="country__row"><span>👫</span>${(
        country.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${country.languages?.eng}</p>
      <p class="country__row"><span>💰</span>${country.currencies.NGN?.name}</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

////////////////////////////////////////
// Outdated way of going around async
// const getCountries = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data.languages[0]);
//     displayCountries(data)
//     console.log(data);
//   });
// };

// promises on async function
const getCountries = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      displayCountries(data[0]);
      console.log(data[0]);
    });
};

getCountries('Nigeria');
getCountries('Spain');
getCountries('japan');
// gettCountries('italy');
// geCountries('portugal');
