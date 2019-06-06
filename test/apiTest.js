process.env.NODE_ENV = 'test';

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../index');

const stockSymbolI = "INTELLECT";
const stockSymbolNotExist = "NOTEXIST";
const userID = "usr1"
const userNotExist = "userNotExist"
const lowPrice = 151.05
const highPrice = 190.70

let requester;

chai.use(chaiHttp);
chai.should();

const object1 = {
    "id": "289691ec",
    "type": "buy",
    "user": {
        "id": userID,
        "name": "Mark"
    },
    "symbol": stockSymbolI,
    "shares": 10,
    "price": highPrice,
    "timestamp": "2019-06-06 12:10:00"
}
const object2 = {
    "id": "289691ed",
    "type": "sell",
    "user": {
        "id": userID,
        "name": "Mark"
    },
    "symbol": stockSymbolI,
    "shares": 12,
    "price": lowPrice,
    "timestamp": "2019-06-06 12:10:00"
}

let InvalidObject1 = JSON.parse(JSON.stringify(object1));
InvalidObject1.id = '289691eq';
InvalidObject1.shares = 9;
InvalidObject1.price = 130.41;

let InvalidObject2 = JSON.parse(JSON.stringify(object1));
InvalidObject2.id = '289691el';
InvalidObject2.shares = 31;
InvalidObject2.price = 195.66;

describe('Trades', () => {
    before(done => {
        server((app) => {
            requester = app;
            done();
        });
    });
    describe('DELETE /erase', () => {
        it('should delete all trades', (done) => {
            chai.request(requester)
                .delete('/erase')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should get zero trades', (done) => {
            chai.request(requester)
                .get('/trades')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('trades');
                    res.body.trades.should.be.a('Array');
                    res.body.trades.should.be.empty;
                    done();
                });
        });
    });
    describe('POST /trade', () => {
        it('should create a trade with id ' + object1.id, (done) => {
            chai.request(requester)
                .post('/trades')
                .send(object1)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
        it('should create a trade with id ' + object2.id, (done) => {
            chai.request(requester)
                .post('/trades')
                .send(object2)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
        it('should get two trades', (done) => {
            chai.request(requester)
                .get('/trades')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('trades');
                    res.body.trades.should.be.a('Array');
                    res.body.trades.should.have.lengthOf(2);
                    done();
                });
        });
        it('should try to create a trade with same ID ' + object1.id + ' and get 400 status', (done) => {
            chai.request(requester)
                .post('/trades')
                .send(object1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should try to create a trade with shares and price lesser than min value and get 400 status', (done) => {
            chai.request(requester)
                .post('/trades')
                .send(InvalidObject1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('should try to create a trade with shares and price greater than max value and get 400 status', (done) => {
            chai.request(requester)
                .post('/trades')
                .send(InvalidObject2)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('GET /trades', () => {
        it('should get the list of trades and the length should be two', (done) => {
            chai.request(requester)
                .get('/trades')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('trades');
                    res.body.trades.should.be.a('Array');
                    res.body.trades.should.have.lengthOf(2)
                    done();
                });
        });
    });
    describe('GET /trades/users/:user', () => {
        it('should get the list of trades of user which exist', (done) => {
            chai.request(requester)
                .get('/trades/users/' + userID)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('trades');
                    res.body.trades.should.be.a('Array');
                    res.body.trades.should.have.lengthOf(2)
                    done();
                });
        });
    });
    describe('GET /trades/users/:user', () => {
        it('should get status 404 for user which does not exist', (done) => {
            chai.request(requester)
                .get('/trades/users/' + userNotExist)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    describe('GET /stocks/{stockSymbol}/trades?type={tradeType}&start={startDate}&end={endDate}', () => {
        it('should get trades of the stock which exist', (done) => {
            chai.request(requester)
                .get('/stocks/' + stockSymbolI + '/trades?type=buy&start=2019-06-01 12:10:00&end=2019-06-10 12:10:00')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('trades');
                    res.body.trades.should.be.a('Array');
                    res.body.trades.should.have.lengthOf(1)
                    done();
                });
        });

        it('should get status 404 to stock which does not exist', (done) => {
            chai.request(requester)
                .get('/stocks/' + stockSymbolNotExist + '/trades?type=buy&start=2019-06-01 12:10:00&end=2019-06-10 12:10:00')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('should get error message for the given date range', (done) => {
            chai.request(requester)
                .get('/stocks/' + stockSymbolI + '/trades?type=buy&start=2019-06-10 12:10:00&end=2019-06-12 12:10:00')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('message').eql('There are no trades in the given date range');
                    done();
                });
        });
    });

    describe('GET /stocks/{stockSymbol}/price?start={startDate}&end={endDate}', () => {
        it('should return the highest and lowest price for the stock symbol', (done) => {
            chai.request(requester)
                .get('/stocks/' + stockSymbolI + '/price?start=2019-06-01 12:10:00&end=2019-06-12 12:10:00')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('symbol').eql(stockSymbolI);
                    res.body.should.have.property('highest').eql(highPrice);
                    res.body.should.have.property('lowest').eql(lowPrice);
                    done();
                });
        });

        it('should get status 404 to stock which does not exist', (done) => {
            chai.request(requester)
                .get('/stocks/' + stockSymbolNotExist + '/price?start=2019-06-01 12:10:00&end=2019-06-10 12:10:00')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('should get error message for the given date range', (done) => {
            chai.request(requester)
                .get('/stocks/' + stockSymbolI + '/price?start=2019-06-10 12:10:00&end=2019-06-12 12:10:00')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('message').eql('There are no trades in the given date range');
                    done();
                });
        });
    });
});

function newFunction() {
    chai.expect();
}
