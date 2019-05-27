var mongoose = require('mongoose');
var tradesSchema = require('./trades.model');
var moment = require('moment');

tradesSchema.statics = {
    create : function(data, cb) {
        var hero = new this(data);
        hero.save(cb);
    },

    get: function(query, cb) {
        this.find(query, cb);
    },

    getByName: function(query, cb) {
        this.find(query, cb);
    },

    update: function(query, updateData, cb) {
        this.findOneAndUpdate(query, {$set: updateData},{new: true}, cb);
    },

    delete: function(query, cb) {
        this.findOneAndDelete(query,cb);
    },

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