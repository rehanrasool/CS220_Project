$(function(){
	var chimpad_user_id=Number(window.location.pathname.match(/\/user\/(\d+)$/)[1]);

	$.ajax
	({
		type:"POST",
		url:"/get_user_profile",
		data:{
			user_id:chimpad_user_id
		}
	}).done(function(raw_data) {
		var data = raw_data[0];

		$('#user_name_head').html(data['username']);
		$('#user_id_val').html(data['id']);
		$('#user_email_val').html(data['email']);
	});
	$.ajax
		({
		type:"POST",
		url:"/get_user_public_pads",
		data:{
			user_id:chimpad_user_id
		}
	}).done(function(raw_data) {
      
      	var tbody = $('#user_pads_table tbody'),
        	props = ["id", "title"];
    		$.each(raw_data, function(i, pad) {
    		  var tr = $('<tr>');
    		  $.each(props, function(i, prop) {
            	if (prop == 'title') {
             	 $('<td>').html('<a href="..\\pad\\' + pad['id'] + '">' + pad[prop] + '</a>').appendTo(tr);  
            	} 
            	else{
              		$('<td>').html(pad[prop]).appendTo(tr);  
            	}
    		  });
    		  tbody.append(tr);
    		});

  	});
});