const bodyParser = require('body-parser');
const express = require('express');
const properties = require('./properties');
const db = require('./database');
const tradesRoutes = require('./trades.routes');

const app = express();
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
const router = express.Router();

app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

app.use(router);
tradesRoutes(router);

const initializer = (cb) => {
    db(() => {
        app.listen(properties.PORT, (req, res) => {
            console.log(`Server is running on ${properties.PORT} port.`);
            cb(app);
        });
    });
}

if (process.env.NODE_ENV != 'test') {
    initializer((app) => { });
}

module.exports = initializer;