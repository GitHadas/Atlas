import { fetchApi, drowMap, fetchByName, fetchByCode } from "./functions.js";

const url = "https://restcountries.com/v3.1/";
const main = document.querySelector("main");
const searchButton = document.querySelector("#searchButton");
const shortcuts = document.querySelectorAll(".shortcut");

const render = async (data, holder) => {
    if (!data || data.length === 0 || !data[0] || !data[0].currencies || data[0].name.common == "Palestine") {
        holder.innerHTML = `<br><p class="text-danger text-center fw-bolder display-4 p-5">country is not found!</p>`;
    } else {
        data = data[0];
        const currencyCode = Object.keys(data.currencies)[0];
        const borders = data.borders ? await Promise.all(
            data.borders
                .filter(border => border !== "PSE")
                .map(border => fetchByCode(border))
        ) : null;

        holder.innerHTML = `
        <section class="row align-items-center" data-aos="zoom-out" data-aos-duration="1000">
            <img class="col-12 col-lg-6 p-5" src=${data.flags.png}>
            <div class="col-12 col-lg-6 p-5 text-white">
                <h1>${data.name.common}</h1>
                <p>
                    population: ${data.population}.<br>
                    region: ${data.region}.<br>
                    languages: ${Object.values(data.languages).join(', ')}.<br>
                    coin: ${currencyCode} - ${data.currencies[currencyCode].name} (${data.currencies[currencyCode].symbol}).<br>
                    capital city: ${data.capital ? data.capital.join(', ') : 'Not available'}.<br>
                    borders: ${borders ? borders.map((border) => `<a href="#" class="border text-white">${border} </a>`) : 'No borders'}.
                </p>
            </div>
        </section>
        <div id="map" class="map m-auto" style="width: 70vw; height: 35vw" data-aos="zoom-out" data-aos-duration="1000"></div>`;
        holder.querySelectorAll(".border").forEach(shortcut => shortcut.addEventListener("click", fetchShortcut));
        const mapHolder = holder.querySelector("#map");
        drowMap(mapHolder, data.latlng[0], data.latlng[1]);
    }
}

const fetchInput = (event) => {
    event.preventDefault();
    const inputValue = document.querySelector("#inputCountry").value;

    fetchApi(url + `name/${inputValue.toLowerCase()}`)
        .then((data) => render(data, main))
        .catch((err) => console.error(err));
}

function fetchShortcut(event) {
    fetchByName(url, event.target.innerText.toLowerCase())
        .then((data) => render(data, main))
        .catch((err) => console.error(err));
}

const fetchHome = (event) => {
    fetchByName(url, event.target.id)
        .then((data) => render(data, main))
        .catch((err) => console.error(err));
}

searchButton.addEventListener("click", fetchInput);
shortcuts.forEach(shortcut => shortcut.addEventListener("click", fetchShortcut));

const createCard = async (obj) => {
    const card = document.createElement('figure');
    card.className = "p-3 col-12 col-lg-3 m-3 rounded";
    card.setAttribute("data-aos", "zoom-in");
    card.setAttribute("data-aos-duration", "1000");
    card.style = "background-color: rgba(255, 255, 255, 0.5)";
    card.innerHTML = `
        <img src=${obj.flags.png} class="w-100 h-50">
        <figcaption class="p-2 text-center w-100">
            <h2>${obj.name.common}</h2>
            <p>
                population: ${obj.population}.<br>
                region: ${obj.region}.<br>
                languages: ${Object.values(obj.languages).join(', ')}.
            </p>
            <button type="button" id=${obj.name.common} class="btn btn-dark">press for more info...</button>
        </figcaption>
    `;
    card.querySelector("button").addEventListener("click", fetchHome);
    return card;
}

const displayHome = () => {
    main.innerHTML = `<br>`;
    const row = document.createElement("div");
    row.className = "row justify-content-center";
    shortcuts.forEach(async (shortcut) => {
        const data = await fetchByName(url, shortcut.innerText);
        const card = await createCard(data[0]);
        row.append(card);
    });
    main.append(row);
}

displayHome();