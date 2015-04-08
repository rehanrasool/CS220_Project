$(function(){

	// getting the id of the room from the url
	var chimpad_pad_id = Number(window.location.pathname.match(/\/pad\/(\d+)$/)[1]);

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/get_pad",
      //json object to sent to the authentication url
      data : {
      pad_id : chimpad_pad_id
    } }).done(function(raw_data) {
      
      	var data = raw_data;
        $('#pad_title').html(data['title']);
        $('#pad_content').val(data['content']);
        $('#pad_content_help_text').html('last modified: ' + data['last_modified_timestamp']);

  	});



});
