var bodyParser = require('body-parser');

var express = require('express');
var properties = require('./properties');
var db = require('./database');
var app = express();


//configure bodyparser
var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({extended:true});

var tradesRoutes = require('./trades.routes');
var router = express.Router();



app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

app.use(router);
tradesRoutes(router);

function Initializer(cb){
    db(()=>{
        app.listen(properties.PORT, (req, res) => {
            console.log(`Server is running on ${properties.PORT} port.`);
            cb(app);
        });
    });
}

if (process.env.NODE_ENV != 'test')
{
    Initializer((app)=>{});
}

module.exports = Initializer;