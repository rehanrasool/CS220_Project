// This file is executed in the browser, when people visit /chat/<random id>

$(function(){

	// getting the id of the room from the url
	var id = Number(window.location.pathname.match(/\/home\/(\d+)$/)[1]);

	// connect to the socket
	var socket = io();

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
