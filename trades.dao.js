var mongoose = require('mongoose');
var tradesSchema = require('./trades.model');
var moment = require('moment');

tradesSchema.statics = {
    deleteTrades: function(callback) {
        this.deleteMany({}, callback)
    },

    createTrades: function(data, cb) {
        var trade = new this(data);
        trade.save(cb);
    },

    getTrades: function(callback) {
        this.find({}, callback).sort({id: 1});
    },
    getTradesByUserID: function(userID, callback) {
        this.find({'user.id': userID}, callback).sort({id: 1});
    },

    getTradesByStockSymbol: function(symbol, type, start, end, cb) {
        this.find({'symbol': symbol,'type':type,'timestamp':{'$gte':start,'$lte': end}}, cb).sort({id:1})
    },
    getTradesByPrice: function(symbol, start, end, cb) {
        this.find({'symbol':symbol,'timestamp':{'$gte':start,'$lte': end}}, cb).sort({price:1})
    },
    checkSymbol: function(symbol, cb) {
        this.findOne({'symbol': symbol}, function(err, trade){
            if (trade) {
                cb(err, true);
              } else {
                cb(err, false);
              }
        });
    }
}

var tradesModel = mongoose.model('Trades', tradesSchema);
module.exports = tradesModel;