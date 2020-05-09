
const fs = require("fs");
const moment = require('moment');

const countryStateListCSVURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv';
const contentURL = 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/data?ref=web-data';
const casesTimeCSVURL = 'https://github.com/CSSEGISandData/COVID-19/raw/web-data/data/cases_time.csv';

let countryStateList: any;

import MySQLQuery from './model/mysql';

const MySQLQueryModel = new MySQLQuery();

import PgSQLQuery from './db-connection/pgsql';

const PgSQLQueryModel = new PgSQLQuery();


import {readCSVFromDirectURL, writeFiles} from './common/read-write-file';
import {hashMatch} from './common/common';
import config from "./config/config";


let MySQLInsert: boolean = false;
let postgresInsert: boolean = false;

const hashPath =  config.fileWritePath + '/hash/db.sha'
const takeDBDump =  config.fileWritePath + '/hash/db-dump.sha'

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
 * @param recordDetails
 * @param countryDetails
 */
function processSingleRecord(recordDetails, countryDetails) {
    try {
        let record = {
            country_code_iso2: countryDetails.iso2,
            country_region: recordDetails.country_region,
            province_state: recordDetails.province_state,
            deaths: parseInt(recordDetails.deaths, 10),
            recovered: parseInt(recordDetails.recovered, 10),
            confirmed: parseInt(recordDetails.confirmed, 10),
            last_update: moment(new Date(recordDetails.last_update)).format('YYYY-MM-DD'),
            record_date: moment(new Date(recordDetails.report_date_string)).format('YYYY-MM-DD')
        }

        if (typeof recordDetails.incident_rate !== 'undefined' && recordDetails.incident_rate != '') {
            record['incident_rate'] = parseFloat(recordDetails.incident_rate).toFixed(2);
        }

        if (typeof recordDetails.active !== 'undefined' && recordDetails.active != '') {
            record['active'] = parseInt(recordDetails.active, 10)
        }

        if (typeof recordDetails.delta_confirmed !== 'undefined' && recordDetails.delta_confirmed != '') {
            record['delta_confirmed'] = parseInt(recordDetails.delta_confirmed, 10)
        }

        if (typeof recordDetails.delta_recovered !== 'undefined' && recordDetails.delta_recovered != '') {
            record['delta_recovered'] = parseInt(recordDetails.delta_recovered, 10)
        }

        if (typeof recordDetails.people_tested !== 'undefined' && recordDetails.people_tested != '') {
            record['people_tested'] = parseInt(recordDetails.people_tested, 10)
        }

        if (typeof recordDetails.people_hospitalized !== 'undefined' && recordDetails.people_hospitalized != '') {
            record['people_hospitalized'] = parseInt(recordDetails.people_hospitalized, 10)
        }

        return record;
    } catch (e) {
        console.log(e);
    }

}

/**
 * Insert into postgres
 * @param record
 */
async function insertPostgres(record) {
    let tempValues: Array<any> = [];
    let values: Array<any> = [];
    let count = 1;
    for (let [, value] of Object.entries(record) as any) {
        tempValues.push('$' + count);
        count += 1;
        values.push(value);

    }
    let query = 'INSERT INTO ' + config.tableName + ' (' + Object.keys(record).join(', ') + ') VALUES(' + tempValues.join(', ') + ')';

    await PgSQLQueryModel.query(query, values).catch(function (e) {
        throw Error(e)
    });

    return true;
}


/**
 * insert into MySQL
 * @param record
 */
async function insertMySQL(record) {
    await MySQLQueryModel.insertQuery(config.tableName, record).catch(function (e) {
        throw Error(e)
    });
    return true;
}


/**
 * truncate MySQL Table
 */
async function truncateMySQLTable() {
    console.log("truncating mysql table");
    await MySQLQueryModel.query('TRUNCATE ' + config.tableName, []).catch(function (e) {
        throw Error(e)
    });
    MySQLInsert = true
    return true;
}

/**
 * truncate Postgres Table
 */
async function truncatePostgresTable() {
    console.log("truncating postgres table");
    await PgSQLQueryModel.query('TRUNCATE ' + config.tableName, []).catch(function (e) {
        throw Error(e)
    });
    postgresInsert = true
    return true;
}




/**
 * starting
 */
async function startProcess() {
    await truncatePostgresTable().catch(function () {
        console.log("error in postgres table");
    });

    await truncateMySQLTable().catch(function () {
        console.log("error in mysql table");
    });

    if(!MySQLInsert  && !postgresInsert){
        throw Error("No database to process")
    }


    try {
        console.log("Start Processing");
        countryStateList = await readCSVFromDirectURL(countryStateListCSVURL);
        let timeSeries: any = await readCSVFromDirectURL(casesTimeCSVURL);
        console.log("start inserting");
        for (let [, details] of Object.entries(timeSeries) as any) {
            let countryDetails = getCountryStateByUID(details.uid)
            let record: any = processSingleRecord(details, countryDetails);

            if (MySQLInsert) {
                await insertMySQL(record);
            }

            if (postgresInsert) {
                await insertPostgres(record);
            }
        }
        return true;
    } catch (e) {
        throw Error(e);
    }

}





/**
 * hash Match and generate
 */
(async function () {
    try {
        let latestSha = await hashMatch(contentURL, 'cases_time.csv', hashPath);
        if (latestSha != '') {
            // we are here to process
            await startProcess();
            await writeFiles(hashPath, latestSha);
            await writeFiles(takeDBDump, 'need to take db dump');
            console.log("We are done with writing files");
            process.exit();
        }

    } catch (e) {
        console.log(e);
        process.exit();
    }
})();


