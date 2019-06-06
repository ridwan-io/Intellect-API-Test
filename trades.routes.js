const Trades = require('./trades.controller');

module.exports = function (router) {
    router.delete('/erase', Trades.deleteTrades);
    router.post('/trades', Trades.createTrades);
    router.get('/trades', Trades.getTrades);
    router.get('/trades/users/:userID', Trades.getTradesByUserID);
    router.get('/stocks/:stockSymbol/trades', Trades.getTradesByStockSymbol);
    router.get('/stocks/:stockSymbol/price', Trades.getTradesByPrice);
}