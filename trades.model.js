var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tradesSchema = new Schema({
    id: { type : String , unique : true, required : true},
    type: String,

    user:{
        id: String,
        name: String
    },
    symbol: String,
    shares : Number,
    price: Number,
    timestamp : {type: Date, default: Date.now}
});

module.exports = tradesSchema;