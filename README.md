# Intellect-API-Test
### Instructions to install and build.
- npm install
- node index.js


### Instructions to run tests.
- npm install --only=dev
- npm test

### Properties.js
This file contains the port and DB URL (MLAB sandbox account is used.)
```javascript
module.exports = {
    PORT : 4000,
    DB : 'mongodb://intellectuser:intellectuser123@ds261716.mlab.com:61716/intellect',
}
```

# Intellect-API-Test Document
### Erasing all trade
* **URL** 
  * ```/erase```
* **Method**
  * ```GET```
* **HTTPresponse**
  * ```200```

### Adding new trade
* **URL** 
  * ```/trades```
* **Method**
  * ```POST```
* **HTTPresponse**
  * Success - ```201```
  * Error - ```400```

### Returning all the trades:
* **URL** 
  * ```/trades```
* **Method**
  * ```GET```
* **HTTPresponse**
  * ```200```
  
### Returning the trade records filtered by the user ID:
* **URL** 
  * ```/trades/users/{userID}```
* **Method**
  * ```GET```
* **HTTPresponse**
  * Success - ```200```
  * Error - ```404```
  
### Returning the trade records filtered by the stock symbol and trade type in the given date range:
* **URL** 
  * ```/stocks/{stockSymbol}/trades?type={tradeType}&start={startDate}&end={endDate}```
* **Method**
  * ```GET```
* **HTTPresponse**
  * Success - ```200```
  * Error - ```404```
  
### Returning the highest and lowest price for the stock symbol in the given date range:
* **URL** 
  * ```/stocks/{stockSymbol}/price?start={startDate}&end={endDate}```
* **Method**
  * ```GET```
* **HTTPresponse**
  * Success - ```200```
  * Error - ```404```
