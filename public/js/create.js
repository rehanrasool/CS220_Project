
$(function(){

	var collaborator_array = new Array();

	$('#add_collaborator_button').click(function(){
		var collaborator_name = $('#inputCollaborators').val();
		collaborator_array.push(collaborator_name);
		var current_names = $('#collaborators_name').html();
		$('#collaborators_name').html(current_names + "," + collaborator_name);
		$('#inputCollaborators').val(""); //empty the field
	});



});