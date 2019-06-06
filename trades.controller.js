const Trades = require('./trades.dao');
const moment = require('moment');
const FORMAT = "yyyy-MM-dd HH:mm:ss";

exports.deleteTrades = (req, res, next) => {
    Trades.deleteTrades((err) => {
        if (err) {
            res.json({
                error: err
            })
        }
        res.status(200).send();
    });
}

exports.createTrades = (req, res, next) => {

    const data = req.body;
    const theDate = moment(data['timestamp']);
    data['timestamp'] = theDate;

    if (!(data.shares && data.shares >= 10 && data.shares <= 30
        && data.price && data.price >= 130.42 && data.price <= 195.65)) {
        res.sendStatus(400);
        return;
    }
    Trades.createTrades(data, function (err) {
        if (err && err.code == 11000) {
            res.sendStatus(400);
            return;
        }
        if (err) {
            res.json({
                error: err
            })
        }
        res.sendStatus(201);
    });
}

exports.getTrades = (req, res, next) => {
    Trades.getTrades((err, trades) => {
        if (err) {
            res.json({
                error: err
            })
        }
        res.json({
            trades: trades
        })
    });
}

exports.getTradesByUserID = (req, res, next) => {
    Trades.getTradesByUserID(req.params.userID, (err, trades) => {
        if (err) {
            res.json({
                error: err
            })
        }
        if (trades.length > 0) {
            res.json({
                trades: trades
            })
        }
        else {
            res.sendStatus(404);
        }
    });
}

exports.getTradesByStockSymbol = (req, res, next) => {
    const stockSymbol = req.params.stockSymbol;
    const tradeType = req.query.type;
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    Trades.checkSymbol(stockSymbol, (err, exist) => {
        if (err) {
            res.json({
                error: err
            })
        }

        if (exist) {
            Trades.getTradesByStockSymbol(stockSymbol, tradeType, startDate, endDate, (err, trades) => {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                if (trades.length > 0) {
                    res.json({
                        trades: trades
                    })
                }
                else {
                    res.json({
                        "message": "There are no trades in the given date range"
                    })
                }
            });
        }
        else {
            res.sendStatus(404);
        }

    });
}

exports.getTradesByPrice = (req, res, next) => {

    const stockSymbol = req.params.stockSymbol;
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);


    Trades.checkSymbol(stockSymbol, (err, exist) => {
        if (err) {
            res.json({
                error: err
            })
        }

        if (exist) {
            Trades.getTradesByPrice(stockSymbol, startDate, endDate, (err, trades) => {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                if (trades.length > 0) {
                    res.json({
                        symbol: trades[0]._id,
                        highest: trades[0].highest,
                        lowest: trades[0].lowest
                    })
                }
                else {
                    res.json({
                        "message": "There are no trades in the given date range"
                    })
                }
            });
        }
        else {
            res.sendStatus(404);
        }
    });
}