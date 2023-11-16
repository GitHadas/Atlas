const fetchApi = async (url) => {
    const res = await fetch(url);
    return res.json();
}

const drowMap = (holder, lat, lon) => {
    const mapEl = document.createElement("div");
    holder.innerHTML = "";
    holder.append(mapEl);
    mapEl.id = `${lat * lon * Math.random()}`;
    mapEl.className = "map";
    mapEl.style.width = "100%";
    mapEl.style.height = "400px";
    const map = L.map(mapEl.id).setView([parseFloat(lat), parseFloat(lon)], 6);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
};

const fetchByName = (url, name) => {
    const urlName = url + `name/${name}`;
    return fetchApi(urlName);
}

const fetchByCode = (countryCode) => {
    return fetchApi(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then((data) => data[0].name.common)
        .catch((err) => err);
}

export { fetchApi, drowMap, fetchByName, fetchByCode };