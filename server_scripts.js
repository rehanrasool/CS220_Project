var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app, io){

  app.use(express.static(__dirname + '/public'));
    // parse application/json
  app.use(bodyParser.json());                        
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', function(req, res){

    // Render views/index.html
    res.render('index');
  });

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
            var id = result.rows[0]["id"];
            global.user_id = id;
            response.redirect('/home/'+id);
           }
        });
      });
  });

  app.post('/get_user_pads', function(request, response) {
      var chimpad_user_id = request.body.user_id;

      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        get_user_pads_id_list = 'SELECT pad_id FROM user_pad WHERE user_id = \'' + chimpad_user_id + '\';';

        client.query(get_user_pads_id_list , function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else
           { 
            var user_pad_ids = "0";
            for (row in result.rows) {
              user_pad_ids = user_pad_ids + "," + result.rows[row]['pad_id'];
            }

            get_user_pads_data = 'SELECT * FROM pad WHERE id IN (' + user_pad_ids + ');';

              client.query(get_user_pads_data , function(err, result) {
                done();
                if (err)
                 { console.error(err); response.send("Error " + err); }
                else
                 { 
                    response.send(result.rows); 
                 }
              });

            //response.send();
           }
        });
      });
  });

  app.post('/get_all_pads', function(request, response) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        get_all_pads_data = 'SELECT * FROM pad;';

        client.query(get_all_pads_data , function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else
           { 
            response.send(result.rows);
           }
        });
      });
  });

  app.post('/get_pad', function(request, response) {
      var chimpad_pad_id = request.body.pad_id;

      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        authenticate_query = 'SELECT * FROM pad WHERE id = ' + chimpad_pad_id + ';';

        client.query(authenticate_query , function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else
           { 
            response.send(result.rows);
           }
        });
      });
  });

  app.get('/create', function(request, response) {
    response.render('create');
  });

  app.get('/find', function(request, response) {
    response.render('find');
  });

  app.get('/about', function(request, response) {
    response.render('about');
  });

  app.get('/index', function(request, response) {
    response.render('index');
  });

  app.get('/home/:id', function(request,response){
    response.render('home');
  });

  app.get('/home', function(request,response){
    response.redirect('/home/'+global.user_id);
  });

  app.get('/pad/:id', function(request,response){
    response.render('pad');
  });

  io.on('connection', function (socket) {
      socket.emit('message', { message: 'welcome to the chat' });
      socket.on('save_pad_content', function (data) {
         socket.emit('message', data);
      });
  });

};

