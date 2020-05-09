import ts from "typescript/lib/tsserverlibrary";

const fs = require('fs');
const path = require('path');

import * as config from "./config/config";

import {writeFiles} from './common/read-write-file';
import ThrowNoProject = ts.server.Errors.ThrowNoProject;

let postManCollection: object = {
    "info": {
        "_postman_id": "73b1a9cd-44cf-40b7-ba06-0e6fb0720a21",
        "name": "COVID-19-API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": []
};


const itemJson = `
{
   "name":"",
   "request":{
      "method":"GET",
      "header":[

      ],
      "body":{
         "mode":"raw",
         "raw":""
      },
      "url":{
         "raw":"https://mahabub81.github.io/covid-19-api/api/v1",
         "protocol":"https",
         "host":[
            "mahabub81",
            "github",
            "io"
         ],
         "path":[
            "covid-19-api",
            "api",
            "v1"
         ]
      }
   },
   "response":[

   ]
}
`


const baseUrl = 'http://mahabub81.github.io/covid-19-api/api/v1';


const mkdirp = require('mkdirp');

const getDirName = require('path').dirname;

async function generateWorldSummary() {
    try {
        let temp = JSON.parse(itemJson);
        temp.name = "World Summary";
        temp.request.url.raw = temp.request.url.raw + '/world-summary.json';
        temp.request.url.path.push('world-summary.json');
        postManCollection['item'].push(temp);
        return true;
    } catch (e) {
        throw Error(e)
    }

}


async function generateWorldTimeSeries() {
    try {
        let temp = JSON.parse(itemJson);
        temp.name = "World Time Series";
        temp.request.url.raw = temp.request.url.raw + '/world-summary-time-series.json';
        temp.request.url.path.push('world-summary-time-series.json');
        postManCollection['item'].push(temp);
        return true;
    } catch (e) {
        throw Error(e)
    }

}

async function allCountriesLatest() {
    try {
        let temp = JSON.parse(itemJson);
        temp.name = "All Countries New Update";
        temp.request.url.raw = temp.request.url.raw + '/countries.json';
        temp.request.url.path.push('countries.json');
        postManCollection['item'].push(temp);
    } catch (e) {
        throw Error(e)
    }

}


async function prepareCountries() {
    try {
        let tempCountries: object = {
            "name": "Countries",
            "item": []
        }

        let tempStates: object = {
            "name": "States",
            "item": []
        }
        let processCountry: Array<any> = [];
        let rawData = fs.readFileSync(config.fileWritePath + '/countries.json');
        let countries = JSON.parse(rawData);
        for (let [index, countryDetails] of Object.entries(countries) as any) {
            let temp = JSON.parse(itemJson);
            temp.name = countryDetails.country_region;
            temp.request.url.raw = temp.request.url.raw + '/countries/' + countryDetails.iso2.toUpperCase() + '.json';
            temp.request.url.path.push('countries');
            temp.request.url.path.push(countryDetails.iso2.toUpperCase() + '.json');
            let stateTempPostMan: any;
            for (let [indexState, stateDetails] of Object.entries(countryDetails.states) as any) {
                if (typeof processCountry[countryDetails.iso2.toUpperCase()] === 'undefined') {
                    processCountry[countryDetails.iso2.toUpperCase()] = 1
                    stateTempPostMan = {
                        "name": countryDetails.iso2.toUpperCase(),
                        "item": []
                    }
                }
                let tempState = JSON.parse(itemJson);
                tempState.name = stateDetails.province_state;
                tempState.request.url.raw = tempState.request.url.raw + '/' + stateDetails.path;
                tempState.request.url.path.push('states');
                tempState.request.url.path.push(countryDetails.iso2.toUpperCase());
                tempState.request.url.path.push(path.parse(stateDetails.path).base);
                stateTempPostMan['item'].push(tempState)

            }

            if (typeof processCountry[countryDetails.iso2.toUpperCase()] !== 'undefined') {
                tempStates['item'].push(stateTempPostMan);
            }

            tempCountries['item'].push(temp);
        }

        postManCollection['item'].push(tempCountries);
        postManCollection['item'].push(tempStates);
        return true;
    } catch (e) {
        throw Error(e)
    }
}




/**
 *
 */
export async function createPostmanCollection() {
    console.log("Creating postman collection");
    try {
        await generateWorldSummary();
        await generateWorldTimeSeries();
        await allCountriesLatest();
        await prepareCountries();
        await writeFiles(config.fileWritePath + '/COVID-19-API.postman_collection.json', JSON.stringify(postManCollection));
        return true;
    } catch (e) {
        console.log(e);
        throw Error(e);
    }
}



