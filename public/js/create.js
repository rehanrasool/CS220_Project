
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
       var text = $('#collaborator_search').val();
       //alert(text);
         $.ajax
	          ({
	            type: "POST",
	            //the url where you want to sent the userName and password to
	            url: "/search_collaborator",
	            //json object to sent to the authentication url
	            data : {
	            chimpad_list_text : text
	          }}).done(function(raw_data) {
      
			      var tbody = $('#all_pads_table tbody'),
			    	props = ["id", "title", "last_modified_timestamp", "last_modified_user"];
					$.each(raw_data, function(i, pad) {
						
						$('#collaborators_list').append("<option value='" + pad['username'] + "/>");
					
  					});

    });
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