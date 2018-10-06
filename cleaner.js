var thing = "8:23";

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
    //get a list of all the country names
    .map(city => city.country)
    //filter down to a unique list of country names
    .filter(toUnique)
    //sort them alphabetically
    .sort()
    //convert the country names into the country objects that we want
    .map(function(countryName){
        //before we make the country obj, we need to get the array of state objs for this country
        var statesOut = cities
        //filter down the cities(csv data) to the ones that have the same countryName
        .filter(city => city.country === countryName)
        //we just want the state names
        .map(city => city.state)
        //filter down to a unique list of state names
        .filter(toUnique)
        //sort them alphabetically
        .sort()
        //convert the state names into the state objects that we want
        .map(function(stateName){
            //before we make the state obj, we need to get the array of city objs for this state
            var citiesOut = cities
                    // filter down to cities that have the same state name as the current state
                    .filter(city => city.state === stateName)
                    // now map them in to the city objects we want
                    .map(city => {
                        return {
                        name : city.name,
                        population: city.population
                        };
                    })
                    //don't forget to sort by population
                    .sort((a,b)=> a.population - b.population);
            //now that we have the array of cities objects for the current state, we can make the state obj for the current stateName
            return {
                name:stateName,
                cities: citiesOut
            }
        }) 
        
        //now that we the array of state objects for the current country, we can make the country obj for the current countryName 
        return {
            name: countryName,
            states : statesOut 
        }
    });

console.log(stringify(countries));