var fs = require('fs'),
dsv = require('d3-dsv'),
stringify = require('json-stringify-pretty-compact'),
csvString = fs.readFileSync('./countries.csv', 'utf8'),
cities = dsv.csvParse(csvString, row =>{
    return {
        country: row.Country,
        state: row.State,
        name: row.City,
        population: row.Population
    };
});

// console.log(cities);

function toUnique(ele,i,arr){
    return arr.indexOf(ele) === i;
}

var countries = cities
    .map(city => city.country)
    .filter(toUnique)
    .sort()
    .map(countryName => ({
            name: countryName,
            states : cities
                .filter(city => city.country === countryName)
                .map(city => city.state)
                .filter(toUnique)
                .sort()
                .map(stateName => ({
                        name:stateName,
                        cities: cities
                            .filter(city => city.state === stateName)
                            .map(city => {
                                return {
                                name : city.name,
                                population: city.population
                                };
                            })
                            .sort((a,b)=> a.population - b.population)
                    }
                ))
        })
    );

console.log(stringify(countries));