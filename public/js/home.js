// This file is executed in the browser, when people visit /chat/<random id>

$(function(){

	// getting the id of the room from the url
	var chimpad_user_id = Number(window.location.pathname.match(/\/home\/(\d+)$/)[1]);

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/checking",
      //json object to sent to the authentication url
      data : {
      get_user_pads: 1,
      user_id : chimpad_user_id
    } }).done(function(raw_data) {
      
      var data = JSON.parse(raw_data);

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
