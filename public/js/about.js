$(function(){

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/get_stats",
      //json object to sent to the authentication url
      data : {
    } }).done(function(raw_data) {
      $('#about_users_count').html(raw_data['users_count']);
      $('#about_public_pads_count').html(raw_data['public_pads_count']);
      $('#about_private_pads_count').html(raw_data['private_pads_count']);

  	});



});
