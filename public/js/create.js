
$(function(){

	var collaborator_array = new array();

	$('#add_collaborator_button').click(function(){
		var collaborator_name = $('#inputCollaborators').val();
		collaborator_array.push(collaborator_name);
		var current_names = $('#collborators_name').val();
		$('#collborators_name').val(current_names + "," + collaborator_name);
		$('#inputCollaborators').val(""); //empty the field
	});



});