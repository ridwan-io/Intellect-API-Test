const mongoose = require('mongoose');
const tradesSchema = require('./trades.model');

tradesSchema.statics = {
    deleteTrades: function (callback) {
        this.deleteMany({}, callback)
    },

    createTrades: function (data, cb) {
        var trade = new this(data);
        trade.save(cb);
    },

    getTrades: function (callback) {
        this.find({}, callback).sort({ id: 1 });
    },

    getTradesByUserID: function (userID, callback) {
        this.find({ 'user.id': userID }, callback).sort({ id: 1 });
    },

    getTradesByStockSymbol: function (symbol, type, start, end, cb) {
        this.find({ 'symbol': symbol, 'type': type, 'timestamp': { '$gte': start, '$lte': end } }, cb).sort({ id: 1 })
    },

    getTradesByPrice: function (symbol, start, end, cb) {
        //this.find({ 'symbol': symbol, 'timestamp': { '$gte': start, '$lte': end } }, cb).sort({ price: 1 })
        this.aggregate([
            { "$match": { 'symbol': symbol, 'timestamp': { '$gte': start, '$lte': end } } },
            {
                '$group': {
                    '_id': '$symbol',
                    'highest': { '$max': '$price' },
                    'lowest': { '$min': '$price' }
                }
            }
        ], cb);
    },

    checkSymbol: function (symbol, cb) {
        this.findOne({ 'symbol': symbol }, function (err, trade) {
            if (trade) {
                cb(err, true);
            } else {
                cb(err, false);
            }
        });
    }
}

const tradesModel = mongoose.model('Trades', tradesSchema);
module.exports = tradesModel;