/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
         console.log(res.body);
         assert.equal(res.body.stockData.likes, 0);
         assert.property(res.body.stockData, "stock");
         assert.property(res.body.stockData, "price");
         assert.property(res.body.stockData, "likes");
          //complete this one too
          
          done();
        }); 
      });
      
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'msft' , like: "true"})
        .end(function(err, res){
         console.log(res.body);
         assert.equal(res.body.stockData.likes, 1);
         assert.property(res.body.stockData, "stock");
          //complete this one too 
          
          done();  
        });         
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'msft' , like: "true"})
        .end(function(err, res){
         console.log(res.body);
         assert.equal(res.body.stockData.likes, 1);
         assert.property(res.body.stockData, "stock");
          //complete this one too
          
          done();  
        });                 
      });
      
      test('2 stocks', function(done) {
       chai.request(server) 
        .get('/api/stock-prices')
        .query({stock: ['msft','bac']
             })
        .end(function(err, res){
         assert.isArray(res.body.stockData);
         assert.property(res.body.stockData[0], "stock");
         assert.property(res.body.stockData[0], "price");
         assert.property(res.body.stockData[0], "rel_likes");
          //complete this one  too 
          
          done();  
        });                 
      });
      
      test('2 stocks with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock:['v','c'],
                like: "true"
             })
        .end(function(err, res){
         assert.isArray(res.body.stockData);
         assert.property(res.body.stockData[0], "stock");
         assert.property(res.body.stockData[0], "price");
         assert.property(res.body.stockData[0], "rel_likes");
         assert.equal(res.body.stockData[0].rel_likes,0);
          
          done();  
        });             
      });
      
    });

});
