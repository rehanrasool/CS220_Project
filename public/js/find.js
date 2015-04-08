$(function(){

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/get_all_pads",
      //json object to sent to the authentication url
      data : {
    } }).done(function(raw_data) {
      
      var tbody = $('#all_pads_table tbody'),
    	props = ["id", "title", "last_modified_timestamp", "last_modified_user"];
		$.each(raw_data, function(i, pad) {
		  var tr = $('<tr>');
		  $.each(props, function(i, prop) {
		    $('<td>').html(pad[prop]).appendTo(tr);  
		  });
		  tbody.append(tr);
		});

  	});



});
