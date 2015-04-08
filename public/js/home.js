// This file is executed in the browser, when people visit /chat/<random id>

$(function(){

	var pg = require('pg');

	// getting the id of the room from the url
	var chimpad_user_id = Number(window.location.pathname.match(/\/home\/(\d+)$/)[1]);


	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		authenticate_query = 'SELECT id FROM user_table WHERE username = \'' + username + '\' AND password = \'' + password + '\';';
		console.log(authenticate_query);
		client.query(authenticate_query , function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { 

		    //console.log(result.rows);
		    //console.log(result.rows[0]);
		    //console.log(result.rows[0]["id"]);
		    
		    //var id = result.rows[0]["id"];
		    
		    //response.send(result.rows);
		    response.send(result.rows);
		    // Redirect to the random room
		    //response.redirect('/home/'+id);
		    //response.render('home');
		   }
		});
	});

	// cache some jQuery objects
	// var section = $(".section"),
	// 	footer = $("footer"),
	// 	onConnect = $(".connected"),
	// 	inviteSomebody = $(".invite-textfield"),
	// 	personInside = $(".personinside"),
	// 	chatScreen = $(".chatscreen"),
	// 	left = $(".left"),
	// 	noMessages = $(".nomessages"),
	// 	tooManyPeople = $(".toomanypeople");

	// // some more jquery objects
	// var chatNickname = $(".nickname-chat"),
	// 	leftNickname = $(".nickname-left"),
	// 	loginForm = $(".loginForm"),
	// 	yourName = $("#yourName"),
	// 	yourEmail = $("#yourEmail"),
	// 	hisName = $("#hisName"),
	// 	hisEmail = $("#hisEmail"),
	// 	chatForm = $("#chatform"),
	// 	textarea = $("#message"),
	// 	messageTimeSent = $(".timesent"),
	// 	chats = $(".chats");

	// // these variables hold images
	// var ownerImage = $("#ownerImage"),
	// 	leftImage = $("#leftImage"),
	// 	noMessagesImage = $("#noMessagesImage");



});
