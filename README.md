# COVID-19-API

We Convert the [Johns Hopkins](https://github.com/CSSEGISandData/COVID-19) university git repo CSV data in JSON format. We have a script which runs every hour to get the updated information from the source repo  [Johns Hopkins](https://github.com/CSSEGISandData/COVID-19) and convert to JSON format. It also inserts the data into MySQL and Postgres Database. 

> **Still working on to set up the automated process to commit hourly**

Data dump for MySQL and Postgres database also available. Also, have a plan to create **Postman Collection**. So anyone can use it efficiently.


We have the following types of converted JSON data. 

1. [World summary.](https://mahabub81.github.io/covid-19-api/api/v1/world-summary.json)  (**File**: *docs/v1/api/world-summary.json*)
2. [List of countries data available and updated COVID-19 data for those countries.](https://mahabub81.github.io/covid-19-api/api/v1/countries.json) (**File**: *docs/v1/api/countries.json*)

3. Specific [Country COVID-19 data](https://mahabub81.github.io/covid-19-api/api/v1/countries/BD.json) by country ISO CODE.
  (**Available countries**: *docs/v1/api/countries/*)
4. Available [states COVID-19 data](https://mahabub81.github.io/covid-19-api/api/v1/states/US/arizona.json) for a specific country.  (**Available States**: *docs/v1/api/states/country_iso_code*)  



This codebase has the following use case.

1. I want to access the JSON data/API only. 
2. I would like to use the database dump only. 
3. I want to run it on our server
    * I only want to serve JSON Data / Rest API from our server.
    * I want to run the data converter on our server.
    * I want to run the data converter and also like to add to the database server (MySQL / Postgres).

    
## Access JSON data / API only
We can directly access the JSON data from ***mahabub81.github.io***, please see the below pattern

1. World summary [https://mahabub81.github.io/covid-19-api/api/v1/world-summary.json](https://mahabub81.github.io/covid-19-api/api/v1/world-summary.json)
2. Available Countries and Their lastest update [https://mahabub81.github.io/covid-19-api/api/v1/countries.json](https://mahabub81.github.io/covid-19-api/api/v1/countries.json)
3. Specific country details time series, Access it by Country Code (Example: BD, US, AU, IN) Example URLS:
	[https://mahabub81.github.io/covid-19-api/api/v1/countries/BD.json](https://mahabub81.github.io/covid-19-api/api/v1/countries/BD.json)
	
	[https://mahabub81.github.io/covid-19-api/api/v1/countries/IN.json](https://mahabub81.github.io/covid-19-api/api/v1/countries/IN.json)
	
	[https://mahabub81.github.io/covid-19-api/api/v1/countries/US.json](https://mahabub81.github.io/covid-19-api/api/v1/countries/US.json)
	
4. By States, States data are not available for all countries, in available **countries.json**, we give an example which countries have states and their relative path. 
  
```
 {
    "uid": "36",
    "iso2": "AU",
    "iso3": "AUS",
    "code3": "36",
    "fips": "",
    "admin2": "",
    "province_state": "",
    "country_region": "Australia",
    "lat": "-25",
    "long_": "133",
    "combined_key": "Australia",
    "population": "25459700",
    "latest": {
      "confirmed": 6752,
      "deaths": 91,
      "recovered": 5715,
      "active": 946,
      "date": "2020-04-29",
      "last_updated_at": "2020-04-30 02:32:27"
    },
    "states": [
      {
        "lat": "-33.8688",
        "long_": "151.2093",
        "combined_key": "New South Wales, Australia",
        "population": "8118000",
        "name": "New South Wales",
        "path": "states/AU/new-south-wales.json",
        "latest": {
          "confirmed": 3016,
          "deaths": 40,
          "recovered": 2284,
          "active": 692,
          "date": "2020-04-29",
          "last_updated_at": "2020-04-30 02:32:27"
        }
      },
```
 So Example URL For **New South Wales, Australia** is
 
 [https://mahabub81.github.io/covid-19-api/api/v1/states/AU/new-south-wales.json](https://mahabub81.github.io/covid-19-api/api/v1/states/AU/new-south-wales.json)
>  The pattern is:  states/Country_Code/state-name.json 

### Example Code
> **Still working on example code, Please let me know if you want to contribute example code on any language and/or any changes**

## Database Dump
MySQL and Postgres Database dump is also available. The table name is **covid19_daywise_data**, you can import the dump and use it.

MySQL dump: [https://github.com/mahabub81/covid-19-api/blob/master/covid-19-mysql-dymp/covid19_daywise_data.sql](https://github.com/mahabub81/covid-19-api/blob/master/covid-19-mysql-dymp/covid19_daywise_data.sql)

Postgres dump: [https://github.com/mahabub81/covid-19-api/blob/master/covid-19-postgres-dump/covid19_daywise_data.sql](https://github.com/mahabub81/covid-19-api/blob/master/covid-19-postgres-dump/covid19_daywise_data.sql)





> **Still working on some example query for both MySQL and Postgres**

## Serve JSON Data from your server
Make sure docker already installed in the server. Clone the repo **[covid-19-api](https://github.com/mahabub81/covid-19-api)** and go to docker folder and run docker-compose up command using only-nginx yaml file. 

```
version: '3.7'
services:
  covid19_api_nginx:
    container_name: covid19_api_nginx
    image: nginx:latest
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - "./../docs:/public_html"
      - "./nginx/nginx.conf:/etc/nginx/nginx.conf:rw"
      - "./nginx/conf.d/:/etc/nginx/conf.d/:rw"
``` 


#####Commands:
```
git clone https://github.com/mahabub81/covid-19-api.git 
cd ./covid-19-api/docker
docker-compose  -f only-nginx.yaml up -d 
```

This will run only nginx on port 80. Change configuration according to your needs. Then you can access the files from below URLs, URLs can be changed based on your base domain.

[http://localhost/api/v1/world-summary.json](http://localhost/api/v1/world-summary.json)

[http://localhost/api/v1/countries.json](http://localhost/api/v1/countries.json)

[http://localhost/api/v1/countries/BD.json](http://localhost/api/v1/countries/BD.json)



> **Set a scheduler to get updated json files from the repo.**

## Run the data converter
Clone the repo and go to docker folder and run command docker-compose up using only-parser yaml file. We prepare a TypeScript file to convert **Johns Hopkins** University repo data to JSON files. Source of the script is in ./src directory. 

All configurations are within Dockerfile, it will automatically check the updated data every hour and prepare JSON files according.

#####Commands:
```
git clone https://github.com/mahabub81/covid-19-api.git 
cd ./covid-19-api/docker
docker-compose  -f only-parser.yaml up -d 
```

### Insert data into the Database [MySQL / Postgres]

We can use the following environment variable in docker-compose file to add data into the database. The database can be existing one or you can spin up a new database using our docker-compose file. 

> Check all the docker-compose files.


##### database config in docker-compose file.
```
# MYSQL
MYSQL_HOST: ${MYSQL_HOST}
MYSQL_DATABASE: ${MYSQL_DATABASE}
MYSQL_USER: ${MYSQL_USER}
MYSQL_PASSWORD: ${MYSQL_PASSWORD}
MYSQL_PORT: ${MYSQL_PORT}

# POSTGRES
POSTGRESS_HOST: ${POSTGRESS_HOST}
POSTGRES_USER: ${POSTGRES_USER}
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
POSTGRES_DB: ${POSTGRES_DB}
```



