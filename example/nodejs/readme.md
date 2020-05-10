
# Node Example

 Run the following command to clone this repo and run the examples

```bash
git clone https://github.com/mahabub81/covid-19-api.git 
cd ./covid-19-api/example/nodejs
npm install
```

## Example

run the following commands and you can see different output based on the script
```javascript
npm run world-time-series
npm run world-summary
npm run latest
```

**See example javascript files.**


## Example code
```javascript
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
 * hash Match and generate */(async function () {  
    try {  
        let response = await worldSummaryTimeSeries();  
  console.log(response);  
  
  } catch (e) {  
        console.log(e);  
  }  
})();
```


## Contributions
you are welcome to give more example. Please make a pull requests.


## License
[MIT](https://choosealicense.com/licenses/mit/)
