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
      
      	var tbody = $('#user_pad_table tbody'),
        	props = ["id", "title", "last_modified_timestamp", "last_modified_user"];
    		$.each(raw_data, function(i, pad) {
    		  var tr = $('<tr>');
    		  $.each(props, function(i, prop) {
            if (prop == 'last_modified_timestamp') {
              $('<td>').html(timeSince(new Date(pad[prop]))).appendTo(tr);
            } else if (prop == 'title') {
              $('<td>').html('<a href="pad\\pad[\'id\']">' + pad[prop] + '</a>').appendTo(tr);  
            } else {
              $('<td>').html(pad[prop]).appendTo(tr);  
            }
    		  });
    		  tbody.append(tr);
    		});

  	});



});
