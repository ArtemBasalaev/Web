(function () {
    var countries = [
        {
            name: "Russia",
            cities: [
                {
                    name: "Moscow",
                    population: 12000000
                },
                {
                    name: "Novosibirsk",
                    population: 1500000
                }
            ]
        },
        {
            name: "France",
            cities: [
                {
                    name: "Paris",
                    population: 2161000
                },
                {
                    name: "Bordeaux",
                    population: 250000
                }
            ]
        },
        {
            name: "USA",
            cities: [
                {
                    name: "New-York",
                    population: 8500000
                },
                {
                    name: "Miami",
                    population: 454000
                },
                {
                    name: "Chicago",
                    population: 2700000
                },
            ]
        }
    ];

    function displayCountriesWithCitiesMaxCount(countries) {
        var citiesMaxCount = 0;

        countries.forEach(function (country) {
            if (country.cities.length > citiesMaxCount) {
                citiesMaxCount = country.cities.length;
            }
        });

        console.log("Страны с максимальным количеством городов: ");

        countries.forEach(function (country) {
            if (country.cities.length === citiesMaxCount) {
                console.log(country.name);
            }
        });
    }

    displayCountriesWithCitiesMaxCount(countries);

    var countriesPopulation = (function (countries) {
        var countriesPopulation = {};

        countries.forEach(function (country) {
            countriesPopulation[country.name] = (country.cities).reduce(function (countryPopulation, city) {
                return countryPopulation += city.population;
            }, 0);
        });

        return countriesPopulation;
    })(countries);

    console.log(countriesPopulation);
})();