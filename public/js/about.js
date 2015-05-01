$(function(){

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/get_stats",
      //json object to sent to the authentication url
      data : {
    } }).done(function(raw_data) {
      var data = raw_data[0];
      $('#about_users_count').html(data['users_count']);
      $('#about_public_pads_count').html(data['public_pads_count']);
      $('#about_private_pads_count').html(data['private_pads_count']);

  	});



});
