var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app, io){

    // parse application/json
  app.use(bodyParser.json());                        
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/db', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM user_table', function(err, result) {
        done();
        if (err)
         { console.error(err); response.send("Error " + err); }
        else
         { response.send(result.rows); }
      });
    });
  })


  app.post('/signup', function(request, response) {
      var username = request.body.inputUsername;
      var password = request.body.inputPassword;
      console.log("post received: %s %s", username, password);

      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        authenticate_query = 'SELECT id FROM user_table WHERE username = \'' + username + '\' AND password = \'' + password + '\';';
        console.log(authenticate_query);
        client.query(authenticate_query , function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else
           { 
            res.render('home');
            response.send(result.rows); 

          }
        });
      });
  });

};

