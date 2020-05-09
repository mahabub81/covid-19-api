const fs = require("fs");
import fetch from 'node-fetch';


/**
 * get commits
 * @param gitFileURL
 */
async function getGitCommitsByURL(gitFileURL) {
    try {
        console.log("getting commits for URL: " + gitFileURL)
        return fetch(gitFileURL)
            .then(res => res.json())
            .then(res => {
                return res
            })
    } catch (e) {
        console.log(e);
        throw Error('something went wrong');
    }
}


/**
 *
 * @param res
 * @param key
 * @param value
 */
async function matchObjectByKeyValue(res, key, value) {
    try {
        return res.find(
            individual => (individual[key] == value)
        );
    } catch (e) {
        throw Error(e);
    }
}



/**
 * return latest sha, in case of matched return blank string
 * @param gitFileURL
 * @param fileName
 * @param localFilePath
 */
export const hashMatch = async (gitFileURL: string, fileName: string, localFilePath: string) => {
    let response = await getGitCommitsByURL(gitFileURL).catch(function (e) {
        throw Error(e)
    });

    let fileDetails: any = await matchObjectByKeyValue(response, 'name', fileName).catch(function (e) {
        throw Error(e)
    });

    if (typeof fileDetails === "undefined") {
        throw Error("Matching file not found")
    }

    let latestHash = fileDetails.sha;

    let savedSha = '';
    try {
         savedSha = fs.readFileSync(localFilePath, 'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('sha file not found, we will create one!', localFilePath);
            return latestHash;
        } else {
            throw Error(e);
        }
    }

    if(latestHash === savedSha){
        throw("everything upto date");
    }

    return latestHash;

}

/**
 * convert object to array
 * @param input
 */
export const convertObjectToArray = async (input: any) => {
    try {
        let arr: Array<any> = [];
        for (let [, ind] of Object.entries(input) as any) {
            arr.push(ind);
        }
        return arr;
    } catch (e) {
        console.log(e);
        throw Error(e)
    }
}


/**
 * prepareStateNameToPath
 * @param stateName
 */
export const prepareStateNameToPath = (stateName) => {
    try {
        return stateName.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
    } catch (e) {
        console.log(e);
        return '';
    }
}