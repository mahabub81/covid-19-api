/**
 * read CSV from direct Repo
 * @param URL
 */
const csv = require('csv-parser')
const request = require("request");
const {StringStream} = require("scramjet");
const fs = require("fs");
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;


export const readCSVFromDirectURL = async (URL: string) => {
    console.log("Start reading file: ", URL);
    let fileData: Array<any> = [];
    return new Promise((resolve, reject) => {
        StringStream.from(request(URL))
            .catch(function (err) {
                reject(err)
            })
            .pipe(csv({
                separator: ',',
                mapHeaders: ({header, index}: { header: String, index: any }) => header.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '_'),
                mapValues: ({header, index, value}: { header: string, index: any, value: string }) => {
                    if (['confirmed', 'deaths', 'recovered', 'active'].includes(header)) {
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
                console.log("End reading file: ", URL);
            });
    });
}


/**
 * write files
 * @param path
 * @param data
 */
export const writeFiles = async (path: string, data: any) => {
    console.log("start to werite file: " + path);
    return new Promise((resolve, reject) => {
        mkdirp(getDirName(path)).then(function () {
            fs.writeFile(path, data, function (err: any) {
                if (err) {
                    reject(err);
                }
                console.log('end write file ' + path);
                resolve(true);
            })

        })

    });
}