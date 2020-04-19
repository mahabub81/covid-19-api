import {type} from "os";

const csvDirectory = '/Users/mahabub/Desktop/COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/*.csv';
const countryListCsvPath = '/Users/mahabub/Desktop/COVID-19/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv'

const fileWritePath = './../docs/api/v1';


import glob from 'glob';

const mkdirp = require('mkdirp');
const fs = require("fs");

const getDirName = require('path').dirname;


const csv = require('csv-parser')

const moment = require('moment');


const request = require("request");


const {StringStream} = require("scramjet");


let countryNameFIxAccordingToCountryNameLookUpTable = {
    "Taiwan": "Taiwan*",
    "South Korea": "Korea, South",
    "Ivory Coast": "Cote d'Ivoire",
    "UK": "United Kingdom",
    "Viet Nam": "Vietnam",
    "The Bahamas": "Bahamas",
    "Bahamas, The": "Bahamas",
    "Gambia, The": "Gambia",
    "The Gambia": "Gambia",
    "Cape Verde": "Cabo Verde",
    "Czech Republic": "Czechia",
    "Hong Kong SAR": "Hong Kong",
    "Macao SAR": "Macau",
    "Macao": "Macau",
    "Iran (Islamic Republic of)": "Iran",
    "Mainland China": "China",
    "East Timor": "Timor-Leste",
    "Republic of Moldova": "Moldova"
}


let countryListFromLookupCSV: any;

let worldData: Array<any> = [];


/**
 * all States Data By country iso2
 */
let allSatesDataByCountryIso2: Array<any> = []


/**
 * AllCounntries Data
 */
let allCountriesDataByIso2: Array<any> = [];


let notFoundCountries: Array<any> = [];

/**
 * get all the files for git location and process them
 */
glob(csvDirectory, {}, function (er, files) {
    processFiles(files).then(function () {
        // write specific Country Files
        writeAllFiles().then(function () {
            console.log("Done Everything");
        })
    });
})


async function writeAllFiles() {

    let countriesData: Array<any> = [];

    try {
        for (let [countryCode, data] of Object.entries(allCountriesDataByIso2) as any) {
            let countryDetails = getCountryDetailsByKeyValue('iso2', countryCode);
            countryDetails['latest'] = data.slice(-1).pop();
            countryDetails['states'] = [];

            if (typeof allSatesDataByCountryIso2[countryCode] !== 'undefined') {
                for (let [stateName, statesData] of Object.entries(allSatesDataByCountryIso2[countryCode]) as any) {
                    let stateFileName = stateName.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
                    await writeFile(fileWritePath + '/states/' + countryCode + '/' + stateFileName + '.json', statesData);
                    //console.log("Write file for country " + countryCode + " States: " + stateName)
                    let provinceDetails = getProvinceDetailsDetails(countryCode, stateName);
                    provinceDetails['path'] = 'states/' + countryCode + '/' + stateFileName + '.json'
                    provinceDetails['latest'] = statesData.slice(-1).pop();
                    countryDetails['states'].push(provinceDetails);
                }

            }

            countriesData.push(countryDetails);

            await writeFile(fileWritePath + '/countries/' + countryCode + '.json', data);
            console.log("Write file for Country: " + countryCode);
        }

        await writeFile(fileWritePath + '/' + 'counties.json', countriesData.sort((a, b) => a.country_region < b.country_region ? -1 : a.country_region > b.country_region ? 1 : 0));
        await writeFile(fileWritePath + '/' + 'world-summary.json', worldData);
        console.log("===>", "We are done with processing");

    } catch (e) {
        console.log(e);
    }

}


/**
 * prepare country list and code accordingly
 */
async function getCountryListsFromLookUPCSVFIle() {
    countryListFromLookupCSV = await parseCSVFileFromPath(countryListCsvPath)

    countryListFromLookupCSV.push({
        iso2: 'PS',
        iso3: 'PSE',
        province_state: '',
        country_region: 'Palestine',
        lat: 31.9521618,
        long_: 35.2331543,
        combined_key: 'Palestine',
        population: 5052000
    });

    countryListFromLookupCSV.push({
        iso2: 'HK',
        iso3: 'HKG',
        province_state: '',
        country_region: 'Hong Kong',
        lat: 22.302711,
        long_: 114.177216,
        combined_key: 'Hong Kong',
        population: 7436154
    });

    countryListFromLookupCSV.push({
        iso2: 'MO',
        iso3: 'MAC',
        province_state: '',
        country_region: 'Macau',
        lat: 22.210928,
        long_: 113.552971,
        combined_key: 'Macau',
        population: 649335
    });
}


/**
 * Process Each Day Data
 * @param countryStateWiseEachDayData
 */
function processEachDayData(countryStateWiseEachDayData: any) {

    for (let [countryName, countryData] of Object.entries(countryStateWiseEachDayData) as any) {
        let countryDetails: any = getCountryDetailsByKeyValue('country_region', countryName);
        if (
            countryDetails !== false &&
            typeof countryDetails.iso2 !== 'undefined' &&
            countryDetails.iso2 != ""
        ) {
            // Initialize
            initializeAllCountriesDataByIso2(countryDetails.iso2);
            let statesData = (typeof countryData['states'] !== 'undefined') ? countryData['states'] : [];
            processEachDayStateData(countryDetails.iso2, statesData);
            delete countryData['states']
            allCountriesDataByIso2[countryDetails.iso2].push(countryData)
        } else {
            if (notFoundCountries.includes(countryName) === false) {
                notFoundCountries.push(countryName);
            }
        }
    }
}


/**
 *
 * @param stateData
 */
function processEachDayStateData(countryIso2Code: string, stateData: any) {
    for (let [stateName, data] of Object.entries(stateData) as any) {
        initializeStateDataByCountryIso2(countryIso2Code, stateName)
        allSatesDataByCountryIso2[countryIso2Code][stateName].push(data);
    }
}

/**
 * process files
 * @param files
 */
async function processFiles(files: object) {

    // get country list from lookup[ file
    await getCountryListsFromLookUPCSVFIle();

    // process every file
    for (let [index, path] of Object.entries(files)) {

        let date: string = path.split('/').pop().split('.')[0];
        let fileData = await parseCSVFileFromPath(path);
        let countryStateWiseEachDayData: any = sumFileData(fileData, date);
        processEachDayData(countryStateWiseEachDayData);
    }
}


/**
 * get country details from lookup table by key value
 * @param key
 * @param value
 */
function getCountryDetailsByKeyValue(key: string, value: string) {
    let countryDetails: any = countryListFromLookupCSV.find(
        country => (country[key].trim().toLowerCase() == value.trim().toLowerCase()
            && country.province_state.trim() == "")
    );

    if (typeof countryDetails === 'undefined') {
        return false
    } else {
        return countryDetails;
    }
}

/**
 * get provience Details
 * @param countryCode
 * @param provinceName
 */
function getProvinceDetailsDetails(countryCode: string, provinceName: string) {
    let provinceDetails: any = countryListFromLookupCSV.find(
        country => (country['iso2'].trim().toLowerCase() == countryCode.trim().toLowerCase()
            && country.province_state.trim().toLowerCase() == provinceName.trim().toLowerCase())
    );

    if (typeof provinceDetails !== 'undefined') {
        return {
            lat: provinceDetails.lat,
            long_: provinceDetails.long_,
            combined_key: provinceDetails.combined_key,
            population: provinceDetails.population,
            name: provinceName

        }
    } else {
        return {
            name: provinceName
        };
    }
}


/**
 * initialize Code
 * @param iso2Code
 */
function initializeAllCountriesDataByIso2(iso2Code: string) {
    if (typeof allCountriesDataByIso2[iso2Code] === 'undefined') {
        allCountriesDataByIso2[iso2Code] = [];
    }
    return true;
}


/**
 * initialize Code
 * @param iso2Code
 */
function initializeStateDataByCountryIso2(iso2Code: string, stateName: String) {
    if (typeof allSatesDataByCountryIso2[iso2Code] === 'undefined') {
        allSatesDataByCountryIso2[iso2Code] = [];
    }

    if (typeof allSatesDataByCountryIso2[iso2Code][stateName] === 'undefined') {
        allSatesDataByCountryIso2[iso2Code][stateName] = [];
    }

    return true;
}


/**
 * prepare the file data
 * @param fileData
 * @param date
 */
function sumFileData(fileData: any, date: string) {

    date = moment(new Date(date)).format('YYYY-MM-DD');
    let sumData: Array<any> = []

    let totalInaDay = {
        confirmed: 0,
        deaths: 0,
        recovered: 0,
        active: 0,
        totalAffectedCountries: 0,
        date: ''
    };

    let countries: number = 0;

    for (let index in fileData) {

        let confirmed = parseInt(fileData[index]['confirmed'], 10);
        let deaths = parseInt(fileData[index]['deaths'], 10);
        let recovered = parseInt(fileData[index]['recovered'], 10);


        // convert Country Name
        let country = fileData[index]['country_region'];

        let stateOrRegion = fileData[index]['province_state'];

        if (typeof countryNameFIxAccordingToCountryNameLookUpTable[country] !== 'undefined') {
            country = countryNameFIxAccordingToCountryNameLookUpTable[country];
        }

        if (typeof sumData[country] === 'undefined') {
            countries += 1;
            sumData[country] = {
                confirmed: 0,
                deaths: 0,
                recovered: 0,
                active: 0,
                //country: country,
                date: date,
                last_updated_at: moment(new Date(fileData[index]['last_update'])).format('YYYY-MM-DD HH:mm:ss'),
                states: []
            }
        }

        if (stateOrRegion.toLowerCase() != "" &&
            country.toLowerCase() !== stateOrRegion.toLowerCase() &&
            typeof sumData[country]['states'][stateOrRegion] === 'undefined') {

            sumData[country]['states'][stateOrRegion] = {
                confirmed: 0,
                deaths: 0,
                recovered: 0,
                active: 0,
                //country: country,
                date: date,
                last_updated_at: moment(new Date(fileData[index]['last_update'])).format('YYYY-MM-DD HH:mm:ss')
            }
        }


        // for specific country
        sumData[country]['confirmed'] += confirmed;
        sumData[country]['deaths'] += deaths;
        sumData[country]['recovered'] += recovered;
        sumData[country]['active'] = sumData[country]['confirmed'] - sumData[country]['deaths'] - sumData[country]['recovered'];


        // country name and region name is nit equal
        if (
            stateOrRegion.toLowerCase() != "" &&
            country.toLowerCase() !== stateOrRegion.toLowerCase()
        ) {
            // for specific region
            sumData[country]['states'][stateOrRegion]['confirmed'] += confirmed;
            sumData[country]['states'][stateOrRegion]['deaths'] += deaths;
            sumData[country]['states'][stateOrRegion]['recovered'] += recovered;
            sumData[country]['states'][stateOrRegion]['active'] = sumData[country]['states'][stateOrRegion]['confirmed'] - sumData[country]['states'][stateOrRegion]['deaths'] - sumData[country]['states'][stateOrRegion]['recovered'];
        }


        // for global counter
        totalInaDay['confirmed'] += confirmed;
        totalInaDay['deaths'] += deaths;
        totalInaDay['recovered'] += recovered;
        totalInaDay['active'] = totalInaDay['confirmed'] - totalInaDay['deaths'] - totalInaDay['recovered'];

    }

    totalInaDay['totalAffectedCountries'] = countries;
    totalInaDay['date'] = date;

    worldData.push(totalInaDay);
    return sumData;
}


/**
 * parse teh CSV file
 * @param filePath
 */
async function parseCSVFileFromPath(filePath: string) {
    let fileData: Array<any> = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({
                separator: ',',
                mapHeaders: ({header, index}: { header: String, index: any }) => header.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '_'),
                mapValues: ({header, index, value}: { header: string, index: any, value: string }) => {
                    if (['confirmed', 'deaths', 'recovered'].includes(header)) {
                        let val = parseInt(value, 10);
                        return isNaN(val) ? 0 : val;
                    } else {
                        return value;
                    }
                }
            }))
            .on('data', (data: any) => {
                fileData.push(data);
            })
            .on('end', () => {
                resolve(fileData);
            });
    });
}


/**
 *
 * @param URL
 */
async function parseCSVFileFromURL(URL: string) {
    let fileData: Array<any> = [];
    return new Promise((resolve, reject) => {
        StringStream.from(request(URL))
            .catch(function (err) {
                console.log(err);
                //reject(err)
            })
            .pipe(csv({
                separator: ',',
                mapHeaders: ({header, index}: { header: String, index: any }) => header.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '_'),
                mapValues: ({header, index, value}: { header: string, index: any, value: string }) => {
                    if (['confirmed', 'deaths', 'recovered'].includes(header)) {
                        let val = parseInt(value, 10);
                        return isNaN(val) ? 0 : val;
                    } else {
                        return value;
                    }
                }
            }))
            .on('data', (data: any) => {
                fileData.push(data);
            })
            .on('end', () => {
                resolve(fileData);
            });
    });
}


/**
 * write file
 * @param path
 * @param data
 */
async function writeFile(path: string, data: any) {
    return new Promise((resolve, reject) => {
        mkdirp(getDirName(path)).then(function () {
            fs.writeFile(path, JSON.stringify(data), function (err: any) {
                if (err) {
                    reject('Something went wrong');
                }
                resolve('We are done with processing');
            })

        })

    });
}






