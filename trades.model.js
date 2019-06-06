const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tradesSchema = new Schema({
    id: { type: String, unique: true, required: true },
    type: String,

    user: {
        id: String,
        name: String
    },
    symbol: String,
    shares: Number,
    price: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = tradesSchema;