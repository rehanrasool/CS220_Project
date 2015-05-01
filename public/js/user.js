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

		$('#user_name_head').val(data['username']);
		$('#user_id_val').val(data['id']);
		$('#user_email_val').val(data['email']);
	});
});