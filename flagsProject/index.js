const DOM = {
    input: document.querySelector("#searchInput"),
    button: document.querySelector("#searchButton"),
    worldWide: document.querySelector("#worldWide"),
    head: document.querySelector("#head"),
    table: document.querySelector("#myTable"),
    regionTable: document.querySelector("#regionTable"),
    content: document.querySelector("#content"),
}

function init() {
    DOM.button.addEventListener("click", countrySearch);
    DOM.worldWide.addEventListener("click", allCountriesSearch);
}
init();

//
//

async function countrySearch() {
    DOM.table.innerHTML = "";
    DOM.regionTable.innerHTML = "";

    try {
        showLoader();
        const result = await searchCountry(DOM.input.value);
        if (!Array.isArray(result)) throw new Error("Api error");
        CalculationOfStatistics(result);
        drawRegion(result);
    } catch (error) {
        swal({
            title: "Something went wrong!",
            icon: "error",
        });
    } finally {
        removeLoader();
    }
}

function CalculationOfStatistics(result) {
    DOM.content.innerHTML = "";

    const amountCountries = result.length;
    let population;
    let totalCountriesPopulation = 0;

    if (Array.isArray(result)) {
        for (let index = 0; index < result.length; index++) {
            population = + result[index].population;
            totalCountriesPopulation += population;
            drawCountry(result[index]);
        }
        drawStatistics(population, amountCountries, totalCountriesPopulation)
    } else {
        drawStatistics(result);
    }
}

function drawStatistics(population, amountCountries, totalCountriesPopulation) {
    DOM.head.innerHTML = "";

    const countryToDraw = document.createElement("h6");
    countryToDraw.innerText = "Average population: " + population;

    const amount = document.createElement("h6");
    amount.innerText = "Total Countries: " + amountCountries;

    const totalPopulation = document.createElement("h6");
    totalPopulation.innerText = "Total Countries Population: " + totalCountriesPopulation;

    DOM.head.append(amount, countryToDraw, totalPopulation);
}


function drawCountry(countryToDraw) {
    const div = document.createElement("div");
    div.className = "card";
    div.style.width = "20rem"
    const img = getImg(countryToDraw?.flags?.png);
    const nameCountry = document.createElement("h5");
    nameCountry.innerText = countryToDraw?.name?.common;
    const population = document.createElement("h6");
    population.innerText = "population:" + countryToDraw?.population;
    const region = document.createElement("h6");
    region.innerText = "region:" + countryToDraw?.region;

    div.classList.add("card1");
    div.append(nameCountry, img, population, region);
    DOM.content.append(div);
}


async function searchCountry(country) {
    const result = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const json = await result.json();
    return json;
}

//
//


async function allCountriesSearch() {
    DOM.regionTable.innerHTML = "";
    try {
        showLoader();
        const result2 = await searchAllCountries(DOM.content.value);
        CalculationOfStatistics(result2);
        searchUnited();
    } catch (error) {
        swal({
            title: "Something went wrong!",
            icon: "error",
        });
    } finally {
        removeLoader();
    }
}


async function searchAllCountries() {
    const result = await fetch(`https://restcountries.com/v3.1/all`);
    const json = await result.json();
    drawRegion(json);
    return json;
}

//

function drawUnited(United) {
    DOM.table.innerHTML = "";

    const table = document.createElement("table");
    table.className = "table table-bordered border-danger "

    const tableRow = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.innerHTML = "Contry:";
    const th2 = document.createElement("th");
    th2.innerHTML = "Number of cityzens:";
    tableRow.append(th1, th2);
    table.append(tableRow);

    for (let index = 0; index < United.length; index++) {
        const tableRow = document.createElement("tr");
        const tdName = document.createElement("td");
        tdName.innerText = United[index].name.common
        const tdPopulation = document.createElement("td");
        tdPopulation.innerText = United[index].population
        tableRow.append(tdName, tdPopulation);
        table.append(tableRow);
    }

    DOM.table.append(table);
}

async function searchUnited() {
    const result = await fetch(`https://restcountries.com/v3.1/name/united`);
    const json = await result.json();
    drawUnited(json);
    return json;
}

//

async function drawRegion(data) {
    const allRegions = data.map(dataRegion => dataRegion.region);
    const region = [];
    for (let index = 0; index < allRegions.length; index++) {
        if (!region.includes(allRegions[index])) {
            region.push(allRegions[index]);
        }
    }

    const table = document.createElement("table");
    table.className = "table table-bordered border-success "
    const tableRow = document.createElement("tr");
    const Regions = document.createElement("th");
    Regions.innerHTML = "Regions";
    const Number = document.createElement("th");
    Number.innerHTML = "Number of contries";
    tableRow.append(Regions, Number);
    table.append(tableRow);
66
    for (let index = 0; index < region.length; index++) {
        const tableRow = document.createElement("tr");
        const name = document.createElement("td");
        name.innerText = region[index];
        const number = document.createElement("td");
        number.innerText = data.filter(name => name.region == region[index]).length;

        tableRow.append(name, number);
        table.append(tableRow);

    }

    DOM.regionTable.append(table);
}

//
//

function showLoader() {
    DOM.content.innerHTML = "";
    const loader = document.createElement("div");
    loader.id = "searchLoader";
    loader.classList.add("spinner-border");
    DOM.content.append(loader);
}

function removeLoader() {
    const loader = document.querySelector("#searchLoader");
    if (loader) {
        loader.remove();
    }
}



