
# COVID-19-API
We are using [Johns Hopkins](https://github.com/CSSEGISandData/COVID-19) university COVID-19 git repo as source data and converting it into **JSON** and **SQL** dump. We have scripts which run periodically to update data in this repository.  


 ## Usage
Base path for **COVID-19-API** is *https://mahabub81.github.io/covid-19-api/api/v1*.

We have the following endpoints 

 1. World summary ([https://mahabub81.github.io/covid-19-api/api/v1/world-summary.json](https://mahabub81.github.io/covid-19-api/api/v1/world-summary.json))
 2. World summary time series ([https://mahabub81.github.io/covid-19-api/api/v1/world-summary-time-series.json](https://mahabub81.github.io/covid-19-api/api/v1/world-summary-time-series.json))
 3. Countries and their latest update ([https://mahabub81.github.io/covid-19-api/api/v1/countries.json](https://mahabub81.github.io/covid-19-api/api/v1/countries.json))
 4. Time series for all countries,  separate endpoint for each country by country ISO code  ( [Bangladesh](https://mahabub81.github.io/covid-19-api/api/v1/countries/BD.json), [USA](https://mahabub81.github.io/covid-19-api/api/v1/countries/US.json), [China](https://mahabub81.github.io/covid-19-api/api/v1/countries/CN.json), [India](https://mahabub81.github.io/covid-19-api/api/v1/countries/IN.json) and others country )
 6. Time Series for only USA states ([New York,](https://mahabub81.github.io/covid-19-api/api/v1/states/US/new-york.json) [Florida](https://mahabub81.github.io/covid-19-api/api/v1/states/US/florida.json) and other US states) 

**Javascript Code example for world summary**
``` javascript
const fetch = require('node-fetch');  
fetch('https://mahabub81.github.io/covid-19-api/api/v1/world-summary.json')  
    .then(res => res.json())  
    .then(json => console.log(json));
```
**output**
```javascript
{
  last_update: '2020-05-10 09:32:31',
  confirmed: 4040289,
  deaths: 279565,
  recovered: 1380716,
  active: 2395111
}
```
**Example for specific country recent update**
```javascript
const fetch = require('node-fetch');  
fetch('https://mahabub81.github.io/covid-19-api/api/v1/countries.json')  
    .then(res => res.json())  
    .then(json => console.log(json.find(country => ( country.iso2.toLowerCase() == 'bd'))));
```
**output**
```javascript
{
  uid: '50',
  iso2: 'BD',
  iso3: 'BGD',
  code3: '50',
  fips: '',
  admin2: '',
  province_state: '',
  country_region: 'Bangladesh',
  lat: '23.685',
  long_: '90.3563',
  combined_key: 'Bangladesh',
  population: '164689383',
  latest: {
    last_updated_at: '2020-05-10',
    confirmed: 14657,
    deaths: 228,
    recovered: 2650,
    active: 11779,
    incident_rate: '8.899784389865617',
    people_tested: '',
    people_hospitalized: '',
    mortality_rate: '1.5555707170635191'
  },
  states: []
}
```


> **Working on more examples.** 

## SQL dump
MySQL and Postgres dump available, we update the dump periodically while there is an update in source repo. Dump updates are less frequent than the JSON data. 

 1. [MySQL](https://github.com/mahabub81/covid-19-api/blob/master/covid-19-mysql-dump/covid19_daywise_data.sql) 
 2. [Postgres](https://github.com/mahabub81/covid-19-api/blob/master/covid-19-postgres-dump/covid19_daywise_data.sql)

> **Working in SQL Example**


## Postman collection
Postman collection:  [https://documenter.getpostman.com/view/3629958/SzmfYHVh](https://documenter.getpostman.com/view/3629958/SzmfYHVh)

## Run in your server
To run the projects in your server clone this git repo and go to docker folder. Based on your need you can choose  specific docker-compose file. 

```bash
git clone https://github.com/mahabub81/covid-19-api.git 
cd ./covid-19-api/docker
# run the complete project
docker-compose up -d
#Run Only nginx comment the above line and uncomment the below line
#docker-compose  -f only-nginx.yaml up -d 
# run only the data parser```
#docker-compose  -f only-parser.yaml up -d 
```



## Contributing
Pull requests are always welcome. For major changes, please open an issue first to discuss what you would like to change.



## License
[MIT](https://choosealicense.com/licenses/mit/)
