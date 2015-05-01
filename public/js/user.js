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
		props=['id','username','email'];
		$('#user_name_head').val(props['username']);
		$('#user_id_val').val(props['id']);
		$('#user_email_val').val(props['email']);

	});
});