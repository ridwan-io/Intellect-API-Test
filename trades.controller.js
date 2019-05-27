var Trades = require('./trades.dao');
var moment = require('moment');
var FORMAT = "yyyy-MM-dd HH:mm:ss";
/*exports.createHero = function (req, res, next) {
    var hero = {
        name: req.body.name,
        description: req.body.description
    };

    Heros.create(hero, function(err, hero) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Hero created successfully"
        })
    })
}

exports.getHeros = function(req, res, next) {
    Heros.get({}, function(err, heros) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            heros: heros
        })
    })
}

exports.getHero = function(req, res, next) {
    Heros.get({name: req.params.name}, function(err, heros) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            heros: heros
        })
    })
}

exports.updateHero = function(req, res, next) {
    var hero = {
        name: req.body.name,
        description: req.body.description
    }
    Heros.update({_id: req.params.id}, hero, function(err, hero) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Hero updated successfully"
        })
    })
}

exports.removeHero = function(req, res, next) {
    Heros.delete({_id: req.params.id}, function(err, hero) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Hero deleted successfully"
        })
    })
}
*/

exports.deleteTrades = function (req, res, next) {
    console.log("delete called");
    Trades.deleteTrades(function(err) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.status(200).send();
    });
}

exports.createTrades = function(req, res, next) {
    
    var data = req.body;
    console.log("create called", data['timestamp']);
    var theDate = moment(data['timestamp']);
    data['timestamp'] = theDate;
    Trades.createTrades(data, function(err) {
        if(err && err.code == 11000)
        {
            res.sendStatus(400);
            return;
        }
        if(err) {
            res.json({
                error : err
            })
        }
        res.sendStatus(201);
    });
}

exports.getTrades = function(req, res, next) {
    console.log("get trade called");
    Trades.getTrades(function(err, trades) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            trades: trades
        })
    });
}

exports.getTradesByUserID = function(req, res, next) {
    Trades.getTradesByUserID(req.params.userID,function(err, trades) {
        if(err) {
            res.json({
                error: err
            })
        }
        if(trades.length > 0) {
            res.json({
                trades: trades
            })
        }
        else {
            res.sendStatus(404);
        }
    });
}

exports.getTradesByStockSymbol = function(req, res, next) {
    var stockSymbol = req.params.stockSymbol;
    var tradeType = req.query.type;
    var startDate = moment(req.query.start) ;
    var endDate = moment(req.query.end);

    Trades.checkSymbol(stockSymbol, function(err, exist){
        if(err) {
            res.json({
                error: err
            })
        }

        if(exist)
        {
            Trades.getTradesByStockSymbol(stockSymbol, tradeType, startDate, endDate, function(err, trades) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(trades.length > 0) {
                    res.json({
                        trades: trades
                    })
                }
                else {
                    res.json({
                        "message":"There are no trades in the given date range"
                    })
                }
            });
        }
        else
        {
            res.sendStatus(404);
        }

    });
}

exports.getTradesByPrice = function(req, res, next) {

    var stockSymbol = req.params.stockSymbol;
    var startDate = req.query.start;
    var endDate = req.query.end;


    Trades.checkSymbol(stockSymbol, function(err, exist){
        if(err) {
            res.json({
                error: err
            })
        }

        if(exist)
        {
            Trades.getTradesByPrice(stockSymbol, startDate, endDate, function(err, trades) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(trades.length > 0) {
                    res.json({
                        symbol : stockSymbol,
                        highest: trades[0].price,
                        lowest: trades[trades.length-1].price
                    })
                }
                else {
                    res.json({
                        "message":"There are no trades in the given date range"
                    })
                }
            });
        }
        else
        {
            res.sendStatus(404);
        }

    });
}