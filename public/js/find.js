$(function(){

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/get_all_pads",
      //json object to sent to the authentication url
      data : {
    } }).done(function(raw_data) {
      @2@
      var tbody = $('#all_pads_table tbody'),
    	props = ["id", "title", "last_modified_timestamp", "last_modified_user"];
		$.each(raw_data, function(i, pad) {
		  var tr = $('<tr>');
      
        $.each(props, function(i, prop) {
            if (prop == 'last_modified_timestamp') {
              $('<td>').html(moment(new Date(pad[prop])).fromNow()).appendTo(tr);
            } else if (prop == 'title') {
              $('<td>').html('<a href="..\\pad\\' + pad['id'] + '">' + pad[prop] + '</a>').appendTo(tr);  
            } else {
              $('<td>').html(pad[prop]).appendTo(tr);  
            }
        });
		  
		  tbody.append(tr);
		});

  	});



});
