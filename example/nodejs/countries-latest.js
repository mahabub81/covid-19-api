const fetch = require('node-fetch');


async function worldSummaryTimeSeries() {
    return fetch('https://mahabub81.github.io/covid-19-api/api/v1/countries.json')
        .then((res) => {
            status = res.status;
            return res.json()
        })
        .then((jsonData) => {
            return jsonData
        })
        .catch((err) => {
            throw Error("some thing went wrong");
        });
}


/**
 * hash Match and generate
 */
(async function () {
    try {
        let response = await worldSummaryTimeSeries();
        console.log(response);

    } catch (e) {
        console.log(e);
    }
})();
