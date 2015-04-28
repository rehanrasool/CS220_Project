$(function(){
	var chimpad_user_id=Number((window.location.pathname.match(/\/home\/(\d+)$/)[1]);

	$.ajax
	({
		type:"POST",
		url:"/get_user_profile",
		data:{
			user_id:chimpad_user_id
		}
	}).done(function(raw_data) {
		var tbody=$('#user_profile tbody'),
		props=['id','username','email'];
		$.each(raw_data,function(i,pad) {
			var tr=$('<tr>');
			$.each(props,function(i,prop){
				$('<td>').html(pad[prop]).appendTo(tr);
			});
			tbody.append(tr);
		});
	});
});