import config from "./config/config";

const moment = require('moment');


const countryStateListCSVURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv';
const casesCountryCSV = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv';
const casesStatesCSV = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_state.csv';
const contentURL = 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/data?ref=web-data';
const casesTimeCSVURL = 'https://github.com/CSSEGISandData/COVID-19/raw/web-data/data/cases_time.csv';
const hashPath = config.fileWritePath + '/hash/api.sha';


import {readCSVFromDirectURL, writeFiles} from './common/read-write-file';
import {hashMatch, convertObjectToArray, prepareStateNameToPath} from './common/common';
import {createPostmanCollection} from './postman';


let countryStateList: any;

let worldSummaryTimeSeries: Array<any> = [];

/**
 * current World Summary
 */
let currentWorldSummary = {
    last_update: '',
    confirmed: 0,
    deaths: 0,
    recovered: 0,
    active: 0
}


/**
 *
 * @param uid
 */
function getCountryStateByUID(uid) {
    return  countryStateList.find(
        country => (parseInt(country['uid'], 10) === parseInt(uid, 10))
    );
}


/**
 *
 * @param countryData
 */
function prepareCurrentWorldSummary(countryData) {
    try {
        currentWorldSummary['last_update'] = countryData.last_update;
        currentWorldSummary['confirmed'] += countryData.confirmed;
        currentWorldSummary['deaths'] += countryData.deaths;
        currentWorldSummary['active'] += countryData.active;
        currentWorldSummary['recovered'] += countryData.recovered;
        return true;
    } catch (e) {
        console.log(e);
        throw Error(e);
    }
}


/**
 * Process Country/States Latest Data Data
 * @param casesCountry
 * @param casesState
 */
function processCountryCases(casesCountry, casesState) {
    return new Promise((resolve, reject) => {
        let countries: Array<any> = [];
        try {
            // process countries
            for (let [, country] of Object.entries(casesCountry) as any) {
                prepareCurrentWorldSummary(country);
                let countryDetails: any = getCountryStateByUID(country.uid);
                // We find the the country in list and did not initialize it again
                if (typeof countryDetails !== 'undefined' && typeof countries[countryDetails.iso2.toLowerCase()] === 'undefined') {
                    countries[country.iso3] = countryDetails;
                    countries[country.iso3]['latest'] = tidyCountryStateRecords(country);
                    countries[country.iso3]['states'] = [];
                }
            }

            // process states only for USA
            for (let [, state] of Object.entries(casesState) as any) {
                if (typeof countries[state.iso3] !== 'undefined' && state.iso3 === 'USA') {
                    let stateDetails = getCountryStateByUID(state.uid);
                    if (typeof stateDetails !== 'undefined') {
                        if (state.iso3 === 'USA') {
                            stateDetails.path = 'states/US/' + prepareStateNameToPath(stateDetails.province_state) + '.json'
                        }
                        stateDetails['latest'] = tidyCountryStateRecords(state);
                        countries[state.iso3]['states'].push(stateDetails);
                    }
                }
            }
            resolve(countries);
        } catch (e) {
            reject(e);
        }
    });

}


/**
 * @param countryOrState
 * @param timeSeries
 */
function tidyCountryStateRecords(countryOrState, timeSeries = false) {
    try {
        let details = {
            last_updated_at: moment(new Date(countryOrState.last_update)).format(config.dateFormat),
            confirmed: countryOrState.confirmed,
            deaths: countryOrState.deaths,
            recovered: countryOrState.recovered,
            active: countryOrState.active,
            incident_rate: countryOrState.incident_rate,
            people_tested: countryOrState.people_tested,
            people_hospitalized: countryOrState.people_hospitalized,
            mortality_rate: countryOrState.mortality_rate
        };

        if (timeSeries) {
            details['report_date'] = moment(new Date(countryOrState.report_date_string)).format(config.dateFormat);
            details['delta_confirmed'] = countryOrState.delta_confirmed;
            details['delta_recovered'] = countryOrState.delta_recovered;
            delete details['mortality_rate'];

        }
        return details;

    } catch (e) {
        throw Error(e)
    }
}


/**
 * cal calculate world summary
 * @param record
 */
async function calculateWorldSummary(record) {
    try {
        if (typeof worldSummaryTimeSeries[record['report_date']] === 'undefined') {
            worldSummaryTimeSeries[record['report_date']] = {
                confirmed: 0,
                deaths: 0,
                date: record['report_date']
            }
        }
        worldSummaryTimeSeries[record['report_date']]['confirmed'] += record.confirmed;
        worldSummaryTimeSeries[record['report_date']]['deaths'] += record.deaths;
        return true;
    } catch (e) {
        throw Error(e)
    }
}


/**
 * process contry or states time series data
 * @param timeSeriesData
 */
async function processCountryStatesTimeSeries(timeSeriesData) {
    let countryStateData: Array<any> = [];
    return new Promise((resolve, reject) => {
        try {
            for (let [, countryOrState] of Object.entries(timeSeriesData) as any) {
                let isCountry = (countryOrState.province_state.trim() === '' && countryOrState.country_region.trim() != '');
                let details = getCountryStateByUID(countryOrState.uid);
                if (details.iso2 != '') {
                    if (typeof countryStateData[details.iso2] === 'undefined') {
                        countryStateData[details.iso2] = []
                    }

                    if (typeof countryStateData[details.iso2]['time_series'] === 'undefined') {
                        countryStateData[details.iso2]['time_series'] = []
                    }

                    if (typeof countryStateData[details.iso2]['states'] === 'undefined') {
                        countryStateData[details.iso2]['states'] = []
                    }

                    let tidyCountryStateData = tidyCountryStateRecords(countryOrState, true);


                    if (isCountry) {
                        calculateWorldSummary(tidyCountryStateData);
                        countryStateData[details.iso2]['time_series'].push(tidyCountryStateData);
                    } else {
                        if (typeof countryStateData[details.iso2]['states'][countryOrState.uid] === 'undefined') {
                            countryStateData[details.iso2]['states'][countryOrState.uid] = [];
                        }

                        countryStateData[details.iso2]['states'][countryOrState.uid].push(tidyCountryStateData);

                    }
                }
            }
            resolve(countryStateData);
        } catch (e) {
            reject(e);
        }
    });
}


/**
 * write countries
 * @param stateCountriesTimeSeries
 */
async function writeIndividualCountryState(stateCountriesTimeSeries) {
    try {
        for (let [countryCode, countryData] of Object.entries(stateCountriesTimeSeries) as any) {
            await writeFiles(config.fileWritePath + '/countries/' + countryCode + '.json', JSON.stringify(countryData['time_series']));
            if (countryCode === 'US') {
                for (let [stateUid, stateData] of Object.entries(countryData['states']) as any) {
                    let statesDetails = getCountryStateByUID(stateUid);
                    let stateFileName = prepareStateNameToPath(statesDetails.province_state);
                    await writeFiles(config.fileWritePath + '/states/' + countryCode + '/' + stateFileName + '.json', JSON.stringify(stateData));
                }
            }
        }
        return true;
    } catch (e) {
        throw Error(e);
    }

}

/**
 * starting
 */
async function startProcess() {
    try {

        countryStateList = await readCSVFromDirectURL(countryStateListCSVURL)
        let casesCountry = await readCSVFromDirectURL(casesCountryCSV)
        let casesState = await readCSVFromDirectURL(casesStatesCSV)
        let countries = await processCountryCases(casesCountry, casesState)
        await writeFiles(config.fileWritePath + '/countries.json', JSON.stringify(await convertObjectToArray(countries)))

        let timeSeriesData = await readCSVFromDirectURL(casesTimeCSVURL);
        let stateCountriesTimeSeries = await processCountryStatesTimeSeries(timeSeriesData);
        await writeIndividualCountryState(stateCountriesTimeSeries)
        await writeFiles(config.fileWritePath + '/world-summary-time-series.json', JSON.stringify(await convertObjectToArray(worldSummaryTimeSeries)))
        await writeFiles(config.fileWritePath + '/world-summary.json', JSON.stringify(currentWorldSummary));
        return true;

    } catch (e) {
        throw Error(e)
    }

}


/**
 * hash Match and generate
 */
(async function () {
    try {
        let latestSha = await hashMatch(contentURL, 'cases.csv', hashPath);
        if (latestSha != '') {
            // we are here to process
            await startProcess();
            await writeFiles(hashPath, latestSha);
            await createPostmanCollection();
            console.log("We are done with writing files");
            process.exit();
        }

    } catch (e) {
        console.log(e);
        process.exit();
    }
})();

