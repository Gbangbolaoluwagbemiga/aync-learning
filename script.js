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
  countriesContainer.style.opacity = 1;

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

// btn.addEventListener('click', function () {
//   getCountries('australia');
// });
// getCountries('queryuudcknjkl[p');
// getCountries('italy');
// getCountries('japan');
// geCountries('portugal');

/*
// coding challenge 1
const whereAmI = function (lat, lng, country) {
  // using it to generate my own location
  // navigator.geolocation.getCurrentPosition(
  //   function (pos) {
  //     console.log(pos);
  //     const { latitude, longitude } = pos.coords;
  //     console.log(latitude, longitude);
  //   },
  //   function () {
  //     console.log('error');
  //   }
  // );
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(response => {
      console.log(response);
      if (!response.ok)
        throw new Error(`something went wrong, error ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(data, `I'm in ${data.city} ${data.country}`);
      return fetch(`https://restcountries.com/v2/name/${country}`);
    })
    .then(response => {
      if (!response.ok) throw new Error(`country not found ${response.status}`);
      return response.json();
    })
    .then(data => {
      displayCountries(data[0]);
      console.log(data[0]);
      const neighbors = data[0].borders;
      if (!neighbors) throw new Error('country has no neighbors');

      return fetch(`https://restcountries.com/v2/alpha/${neighbors[0]}`);
    })
    .then(res => res.json())
    .then(data => displayCountries(data, 'neighbour'))
    .catch(err => console.log(`${err.message}. Try again `))
    .finally(() => (countriesContainer.style.opacity = 1));
};
whereAmI(6.4474, 3.3903, 'nigeria');

/////////////////////////////////
//Handling promises
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('lottery is happening');
  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolve(`you won🥂🏆`);
    } else {
      reject(new Error(`you loss😢`));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

////////////////////////////////
//Promsifying

const promiserFunc = sec => {
  return new Promise(function (resolve) {
    setTimeout(resolve, sec * 1000);
  });
};
promiserFunc(2)
.then(() => {
  console.log(`i waited 2 sec`);
  return promiserFunc(3);
})
.then(() => console.log('i waited 3 sec'));

///////////////////
// Direct promises
Promise.resolve('How are you').then(x => console.log(x));
Promise.reject(new Error('i am not good')).then(y => console.log(y));

/////////////////////
// Trying to promisify the geolocation api and modifying of coding challenge 1
*/
const getCurrentPos = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   pos => console.log(pos),
    //   err => console.log(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

/*
  const checkCurrentLocation = function () {
  getCurrentPos()
  .then(res => {
    const { latitude: lat, longitude: lng } = res.coords;
    // console.log(latitude, longitude);
    return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(response => {
      console.log(response);
      if (!response.ok)
      throw new Error(`something went wrong, error ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(data, `I'm in ${data.city} ${data.country}`);
      return fetch(`https://restcountries.com/v2/name/${data.country}`);
    })
    .then(response => {
      if (!response.ok) throw new Error(`country not found ${response.status}`);
      return response.json();
    })
    .then(data => {
      displayCountries(data[0]);
      console.log(data[0]);
      const neighbors = data[0].borders;
      if (!neighbors) throw new Error('country has no neighbors');
      
      return fetch(`https://restcountries.com/v2/alpha/${neighbors[0]}`);
    })
    .then(res => res.json())
    .then(data => displayCountries(data, 'neighbour'))
    .catch(err => console.log(`${err.message}. Try again `))
    .finally(() => (countriesContainer.style.opacity = 1));
  };
  checkCurrentLocation();
  // btn.addEventListener('click', checkCurrentLocation);
  
  */
////////////////////
// praticing creation of html element from scratch using js(coding challenge 2)
// const createImgEl = document.createElement('p');
// createImgEl.textContent = 'hi';
// btn.append(createImgEl);
// console.log(createImgEl);

//////////////////////
// Async await
const whereAmI = async function () {
  try {
    // Getting the latitude and longitude form the geolocation api
    const pos = await getCurrentPos();
    const { latitude: lat, longitude: lng } = pos.coords;

    // awaiting the geocoding api
    const res = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!res.ok) throw new Error(`Unable to fetch data,Error ${res.status}`);
    const data = await res.json();

    // Country api
    const countryDetails = await fetch(
      `https://restcountries.com/v2/name/${data.country}`
    );
    if (!countryDetails.ok)
      throw new Error(
        `Unable to get the location of your country,Error ${countryDetails.status}`
      );

    const data2 = await countryDetails.json();
    displayCountries(data2[0]);

    // Neighborhood api
    const neighbourhood = await fetch(
      `https://restcountries.com/v2/alpha/${data2[0].borders[0]}`
    );
    if (!neighbourhood.ok)
      throw new Error(
        `your country has no neighbor,Error ${neighbourhood.status}`
      );

    const neighbor = await neighbourhood.json();
    displayCountries(neighbor, 'neighbour');

    return `you're in ${data.city},${data.country}`;
  } catch (err) {
    console.error(err);
    catchError(`${err.message}🎇`);

    // Reject promise returned from an async function
    throw err;
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

console.log(`1: will get location`);
// The commented code below won't work.
// const userDetails = whereAmI();
// console.log(userDetails);

/////////////////////
// Bad practice, why combine the then method with the saync await
// whereAmI()
//   .then(city => console.log(`2: ${city}`))
//   .catch(err => console.error(`2: ${err.message}🎇`))
//   .finally(() => console.log(`3: finished getting location`));

// This is a self calling function (IIFE)
(async function () {
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message}🎇`);
  } finally {
    console.log(`3: finished getting location`);
  }
})();

const getCountriesInfo = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJson(`https://restcountries.com/v2/name/${c1}`);
    // const [data2] = await getJson(`https://restcountries.com/v2/name/${c2}`);
    // const [data3] = await getJson(`https://restcountries.com/v2/name/${c3}`);
    // console.log([data1.capital, data2.capital, data3.capital]);

    // A better method to the above illustration
    const data = await Promise.all([
      getJson(`https://restcountries.com/v2/name/${c1}`),
      getJson(`https://restcountries.com/v2/name/${c2}`),
      getJson(`https://restcountries.com/v2/name/${c3}`),
    ]);
    const individualData = data.map(d => d[0].capital);
    const [_, hi] = individualData;
    console.log(hi);
  } catch (err) {
    console.error(err);
  }
};
getCountriesInfo('Nigeria', 'kenya', 'ghana');
