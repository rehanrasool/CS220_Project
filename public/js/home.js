$(function(){

	// getting the id of the room from the url
	var chimpad_user_id = Number(window.location.pathname.match(/\/home\/(\d+)$/)[1]);

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/get_user_pads",
      //json object to sent to the authentication url
      data : {
      user_id : chimpad_user_id
    } }).done(function(raw_data) {
      
      var data = JSON.parse(raw_data);

  	});



});
