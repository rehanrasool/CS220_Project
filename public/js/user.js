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
      
			var tbody = $('#user_pad_table tbody'),
        	props = ["id", "title", "last_modified_timestamp", "username"];
    		$.each(raw_data, function(i, pad) {
    		  var tr = $('<tr>');
    		  $.each(props, function(i, prop) {
            if (prop == 'last_modified_timestamp') {
              $('<td>').html(moment(new Date(pad[prop])).fromNow()).appendTo(tr);
            } else if (prop == 'title') {
              $('<td>').html('<a href="..\\pad\\' + pad['id'] + '">' + pad[prop] + '</a>').appendTo(tr);  
            } else if(prop =='username'){
              $('<td>').html('<a href="..\\user\\' + pad['last_modified_user'] + '">' + pad[prop] + '</a>').appendTo(tr);  
            }else{
              $('<td>').html(pad[prop]).appendTo(tr);  
            }
    		  });
    		  tbody.append(tr);	
  			});
	});
	$.ajax
	({
		type:"POST",
		url:"/get_user_contributions",
		data:{
			user_id:chimpad_user_id
		}
	}).done(function(raw_data) {
		var data = raw_data[0];
		$('#user_contributions').html(data['number']);
	});
	$.ajax
	({
		type:"POST",
		url:"/get_user_pad_ownerships",
		data:{
			user_id:chimpad_user_id
		}
	}).done(function(raw_data) {
		var data = raw_data[0];
		$('#user_pad_ownerships').html(data['number']);
	});
	$.ajax
	({
		type:"POST",
		url:"/get_user_skills",
		data:{
			user_id:chimpad_user_id
		}
	}).done(function(raw_data) {
		var data = raw_data[0];
		$('#user_skills').html(data['lang']);
	});
});