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
                },
                {
                    name: "Omsk",
                    population: 1150000
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
                }
            ]
        }
    ];

    function getCountriesWithCitiesMaxCount(countries) {
        var citiesMaxCount = countries.reduce(function (citiesMaxCount, country) {
            return Math.max(citiesMaxCount, country.cities.length);
        }, 0);

        return countries.filter(function (country) {
            return country.cities.length === citiesMaxCount;
        });
    }

    var countriesWithCitiesMaxCount = getCountriesWithCitiesMaxCount(countries);
    console.log("Страны с максимальным количеством городов:");
    console.log(countriesWithCitiesMaxCount);

    function getCountriesPopulations(countries) {
        var countriesPopulations = {};

        countries.forEach(function (country) {
            countriesPopulations[country.name] = country.cities.reduce(function (countryPopulation, city) {
                return countryPopulation + city.population;
            }, 0);
        });

        return countriesPopulations;
    }

    var countriesPopulations = getCountriesPopulations(countries);
    console.log("Население стран:");
    console.log(countriesPopulations);
})();