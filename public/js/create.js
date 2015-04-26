
$(function(){

	var collaborator_array = new Array();

	$('#add_collaborator_button').click(function(){
		var collaborator_name = $('#inputCollaborators').val();
		if(collaborator_name != ""){
			collaborator_array.push(collaborator_name);
			var current_names = $('#collaborators_name').html();
			$('#collaborators_name').html(current_names + "," + collaborator_name);
			$('#inputCollaborators').val(""); //empty the field
		}
	});

	$("#collaborator_search").bind('keyup', function(){
       var text = $('#pad_content').val();
        
    }); 



	$("#create_button").click(function(){
		var chimpad_pad_title = $('#pad_title').val();
	        $.ajax
	          ({
	            type: "POST",
	            //the url where you want to sent the userName and password to
	            url: "/create_pad",
	            //json object to sent to the authentication url
	            data : {
	            pad_title : chimpad_pad_title,
	            pad_collaborators : collaborator_array
	          } }).done(function(raw_data) {
	              var pad_id = raw_data[0]['id'];
	              var url = "/pad/" + pad_id;    
				  $(location).attr('href',url);          
	          });

	    }); 



});