process.env.NODE_ENV = 'test';

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../index');

chai.use(chaiHttp);
chai.should();
var requester;
describe('Trades', () => {
    before(done => {
        server((app)=>{
            requester = app;
            done();
        } );
    });
    describe('DELETE /erase', ()=>{
        it('should delete all trades',(done)=> {
            chai.request(requester)
                 .delete('/erase')
                 .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
        });
    });
    describe('POST /trade', ()=>{
        it('should create a trade',(done)=> {
            chai.request(requester)
                 .post('/trades')
                 .send({
                        "id":"QWERTAS",
                        "type": "buy",
                        "user" : {
                            "id":"usr1",
                            "name" : "Mark"
                        },
                        "symbol": "NSDQ",
                        "shares":10,
                        "price" : 130.42,
                        "timestamp" : "2019-05-27 01:52:03"
                    })
                 .end((err, res) => {
                     res.should.have.status(201);
                     done();
                  });
        });
    });
    describe('POST /trade', ()=>{
        it('should try to create a trade with same ID and get 400 status',(done)=> {
            chai.request(requester)
                 .post('/trades')
                 .send({
                        "id":"QWERTAS",
                        "type": "buy",
                        "user" : {
                            "id":"usr1",
                            "name" : "Mark"
                        },
                        "symbol": "NSDQ",
                        "shares":10,
                        "price" : 130.42,
                        "timestamp" : "2019-05-27 01:52:03"
                    })
                 .end((err, res) => {
                     res.should.have.status(400);
                     done();
                  });
        });
    });
    describe('GET /trades', ()=>{
        it('should get the list of trades',(done)=> {
            chai.request(requester)
                 .get('/trades')
                 .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
        });
    });
    describe('GET /trades/users/:user', ()=>{
        it('should get the list of trades of user which exist',(done)=> {
            chai.request(requester)
                 .get('/trades/users/usr1')
                 .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
        });
    });
    describe('GET /trades/users/:user', ()=>{
        it('should get the list of trades of user which does not exist',(done)=> {
            chai.request(requester)
                 .get('/trades/users/usr2')
                 .end((err, res) => {
                     res.should.have.status(404);
                     done();
                  });
        });
    });
    describe('GET /stocks/{stockSymbol}/trades?type={tradeType}&start={startDate}&end={endDate}', ()=>{
        it('should get trades of the stock which exist',(done)=> {
            chai.request(requester)
                 .get('/stocks/NSDQ/trades?type=buy&start=2019-05-25 01:52:03&end=2019-05-29 01:52:03')
                 .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
        });
    });
    describe('GET /stocks/{stockSymbol}/trades?type={tradeType}&start={startDate}&end={endDate}', ()=>{
        it('should get status 404 to stock which does not exist',(done)=> {
            chai.request(requester)
                 .get('/stocks/NSD/trades?type=buy&start=2019-05-25 01:52:03&end=2019-05-29 01:52:03')
                 .end((err, res) => {
                     res.should.have.status(404);
                     done();
                  });
        });
    });
    describe('GET /stocks/{stockSymbol}/price?start={startDate}&end={endDate}', ()=>{
        it('should return the highest and lowest price for the stock symbol',(done)=> {
            chai.request(requester)
                 .get('/stocks/NSDQ/price?start=2019-05-25 01:52:03&end=2019-05-29 01:52:03')
                 .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
        });
    });
});  