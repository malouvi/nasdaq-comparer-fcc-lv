/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const axios = require('axios');
//var MongoClient = require('mongodb');

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {}); 

module.exports = function (app,db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
    console.log('ROUTE GET');
    console.log(req.query );
    console.log(Array.isArray(req.query.stock));
    if(!Array.isArray(req.query.stock)) {
      const stock = req.query.stock.toUpperCase();
      let add = {$set: {"stock":stock}};
      let ip;
      if(req.query.like=="true" ){
        //ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        var original = false;
        ip = req.header('x-real-ip') || req.connection.remoteAddress;
        
        console.log(ip);
        add ={$set: {"stock":stock}, $addToSet: {"ip": ip  }};

        
      }

      
      console.log('GET');
     // console.log(req.query);


      db.collection('stocklikes').findOneAndUpdate({"stock":stock}, add ,{returnOriginal: false, upsert: true},(err, data) => {
        console.log('fou');
        console.log(data.value);
        if(err) {
          return console.log(err+' Error occurred while update ');
          }
        const route = 'https://api.iextrading.com/1.0/stock/'+stock+'/price';
        console.log(route);

        axios.get(route)
          .then(response => {
           // console.log(response.data);
          const stockData = {"stock": stock, "likes": (!data.value.ip)?0:data.value.ip.length, "price": response.data.toString()};
         // console.log(stockData);

          return res.json({stockData});
          })
          .catch(error => {
            console.log(error);
        });


      });
    }
    else {
      let stock1 = req.query.stock[0].toUpperCase();
      let add1= {$set: {"stock":stock1}};
      let stock2 = req.query.stock[1].toUpperCase(); 
      let add2 = {$set: {"stock":stock2}}; 
      let ip;
      console.log(req.query.like);
      if(req.query.like=="true" ){
        ip = req.header('x-real-ip') || req.connection.remoteAddress;
        add1={$set: {"stock":stock1}, $addToSet: {"ip": ip  }};
        add2={$set: {"stock":stock2}, $addToSet: {"ip": ip  }};
      }
      console.log('GET');
      console.log(req.query);


    db.collection('stocklikes').findOneAndUpdate({"stock":stock1}, add1 ,{returnOriginal: false, upsert: true},(err, data) => {
      console.log('stockData1');  
      console.log(data.value);
        if(err) {
          return console.log(' Error occurred while update 1');
          }
        const route = 'https://api.iextrading.com/1.0/stock/'+stock1+'/price';
        console.log(route);

        axios.get(route)
          .then(response => {
            console.log(response.data);
          let stockData1= {"stock": stock1, "likes": (!data.value.ip)?0:data.value.ip.length, "price": response.data.toString()};
          console.log(stockData1);
        db.collection('stocklikes').findOneAndUpdate({"stock":stock2}, add2,{returnOriginal: false, upsert: true},(err, data2) => {
          console.log(data2.value); 
          if(err) {
            return console.log(' Error occurred while update 2');
            }
          const route = 'https://api.iextrading.com/1.0/stock/'+stock2+'/price';
          console.log(route);

          axios.get(route)
            .then(response => {
           //   console.log(response.data);
            let stockData2 = {"stock": stock2, "likes": (!data2.value.ip)?0:data2.value.ip.length, "price": response.data.toString()};
            console.log(stockData2);
            let r_likes = stockData1.likes - stockData2.likes;
            stockData1.rel_likes = r_likes;
            stockData2.rel_likes = 0 - r_likes;
            delete stockData1.likes;
            delete stockData2.likes;
            console.log([stockData1,stockData2]);
            console.log(stockData1);
            console.log(stockData2);
            return res.json({stockData:[stockData1,stockData2]});


            })
            .catch(error => {
              console.log('error axios 2');
          });

        });        
            })
            .catch(error => {
              console.log('error axios 1');
          });
        });
    }
  });
 

    
  };
