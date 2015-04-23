var pg = require('pg');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');


module.exports = function(app, io) {

  var sess;
  app.use(session({secret: 'ssshhhhh'}));

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


  app.post('/login', function(request, response) {
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

            sess=request.session;
            sess.user_id=id;
            //global.user_id = id;

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

            get_user_pads_data = 'SELECT id,title,content,date_part(\'epoch\',last_modified_timestamp)*1000 as last_modified_timestamp,last_modified_user FROM pad WHERE id IN (' + user_pad_ids + ') ORDER BY last_modified_timestamp DESC;';

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
        get_all_pads_data = 'SELECT id,title,content,date_part(\'epoch\',last_modified_timestamp)*1000 as last_modified_timestamp,last_modified_user FROM pad ORDER BY last_modified_timestamp DESC;';

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


  app.post('/create_pad', function(request, response) {
    sess=request.session;
    var chimpad_pad_title = request.body.pad_title;
    var chimpad_pad_user = sess.user_id;
    //var date = new Date();

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      save_or_update_pad_query = 'INSERT INTO pad (title,last_modified_timestamp,last_modified_user) VALUES (\'' + chimpad_pad_title + '\', NOW() ,' + chimpad_pad_user + ') RETURNING id;';
      console.log(save_or_update_pad_query);
      client.query(save_or_update_pad_query , function(err, result) {
        done();
        if (err)
         { console.error(err); response.send("Error " + err); }
        else
         { 
            var chimpad_pad_id = result.rows[0]['id'];
            console.log("pad created with id " + chimpad_pad_id);

            update_user_pads_query = 'INSERT INTO user_pad(user_id,pad_id,admin) VALUES (' + chimpad_pad_user + ',' + chimpad_pad_id + ',1);';
            console.log(update_user_pads_query);
            client.query(update_user_pads_query , function(err, result) {
              done();
              if (err)
               { console.error(err); response.send("Error " + err); }
              else
               { // send pad id to be redirected to it
                response.redirect('/pad/'+chimpad_pad_id);
               }
              });
          }
        
      });
    });
  });

  //save content on pressing the save button
  app.post('/save_pad', function(request, response) {
    sess=request.session;
    var chimpad_pad_id = request.body.pad_id;
    var chimpad_pad_content = request.body.pad_content;
    var chimpad_pad_user = sess.user_id;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      save_or_update_pad_query = 'UPDATE pad SET last_modified_timestamp = NOW() ,content =  \'' + chimpad_pad_content + '\' ,last_modified_user = '+ chimpad_pad_user + ' WHERE id = ' + chimpad_pad_id + ';';

      client.query(save_or_update_pad_query , function(err, result) {
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
        authenticate_query = 'SELECT id,title,content,date_part(\'epoch\',last_modified_timestamp)*1000 as last_modified_timestamp,last_modified_user FROM pad WHERE id = ' + chimpad_pad_id + ';';

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

 /**
  If user is admin then all the people from the pad are deleted along with him.
  If user is not an admin then only he is removed from the pad.
 **/ 
  app.post('/leave_pad', function(request, response) {
      sess=request.session;
      var chimpad_user_id = sess.user_id; // user's id
      var chimpad_pad_id = request.body.pad_id;

      pg.connect(process.env.DATABASE_URL, function(err, client, done) {

        check_if_user_admin_query = 'SELECT admin FROM user_pad WHERE user_id = ' + chimpad_user_id + 'AND pad_id =' + chimpad_pad_id + ';';

        client.query(check_if_user_admin_query , function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else
          { 
            if(result.row[0].admin == 1){//user is admin, so remove all the users from this pad and delete pad
               remove_users_from_this_pad = 'DELETE FROM user_pad WHERE pad_id ='+ chimpad_pad_id + ';'; // delete all user's pad with this id
               client.query(check_if_user_admin_query , function(err, result) {
               done();
               if (err)
                 { console.error(err); response.send("Error " + err); }
                else
                {// all pads from user's now deleted, now delete the pad itself
                  delete_pad(chimpad_pad_id);              
                }
            }
            }else{// user not admin, so just remove him from the pad
               remove_users_from_this_pad = 'DELETE FROM user_pad WHERE pad_id ='+ chimpad_pad_id + 'AND user_id ='+ chimpad_user_id +';'; // delete all user's pad with this id
               client.query(check_if_user_admin_query , function(err, result) {
               done();
               if (err)
                 { console.error(err); response.send("Error " + err); }
                else
                {// all pads from user's now deleted, now delete the pad itself
                  response.send("Success");
                }
                });
       
            });
          });
        });
      });
  });


/**
 Deletes a pad and return true if deletion was successful.
 
 If user is admin and the pad exists then it is deleted -> return true
 
 If user is not an admin then he does not have the permission to delete the 
 pad and thus -> return false
**/
  app.post('/delete_pad', function(request, response) {
        sess=request.session;
        var chimpad_user_id = sess.user_id; // user's id
        var chimpad_pad_id = request.body.pad_id; // pad's id

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        check_if_user_admin_query = 'SELECT admin FROM user_pad WHERE user_id = ' + chimpad_user_id + 'AND pad_id =' + chimpad_pad_id + ';';
           client.query(check_if_user_admin_query , function(err, result) {
            done();
            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            { 
              if(result.row[0].admin == 1){//user is admin, so remove all the users from this pad and delete pad -> return true
                 remove_users_from_this_pad = 'DELETE FROM user_pad WHERE pad_id ='+ chimpad_pad_id + ';'; // delete all user's pad with this id
                 client.query(check_if_user_admin_query , function(err, result) {
                 done();
                 if (err)
                   { console.error(err); response.send("Error " + err); }
                  else
                  {// all pads from user's now deleted, now delete the pad itself
                    delete_pad(chimpad_pad_id);  
                    return true;            
                  }
              }
              }else{// user not admin, so just return false
                 return false;
         
              });
            });
          });
        });
    });
    

//gets all users
  app.post('/get_all_users', function(request, response) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        get_all_users_data = 'SELECT * FROM user;';

        client.query(get_all_users_data , function(err, result) {
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

   //gets a specific user with the provided id in the post request 
  app.post('/get_user', function(request, response) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {

        var user_id = request.body.user_id;// user id in the header

        get_user_data = 'SELECT * FROM user WHERE id =' + user_id + ';';

        client.query(get_user_data , function(err, result) {
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
    sess=request.session;
    response.redirect('/home/'+sess.user_id);
  });

  app.get('/pad/:id', function(request,response){
    response.render('pad');
  });

  io.on('connection', function (socket) {
      socket.on('load',function(data){ 
        socket.room = data;
        socket.join(data);
      });
      socket.on('send_message', function (data) {
          socket.broadcast.to(socket.room).emit('message', data);
      });
  });



};