
$(function(){

	var collaborator_array = new Array();

	$('#add_collaborator_button').click(function(){
		var collaborator_name = $('#collaborator_search').val();
		if(collaborator_name != ""){
			collaborator_array.push(collaborator_name);
			var current_names = $('#collaborators_name').html();
			
			$('#collaborators_name').html(current_names + " , " + collaborator_name);
				
			$('#collaborator_search').val(""); //empty the field
		}
	});

	$("#collaborator_search").on('input', function(){
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

	          	var data = raw_data;
      			$('#collaborators_list').empty();
				$.each(data, function(key, value) {
					$('#collaborators_list').append('<option value="' + value['username'] + '"/>');
				});

    });
});     



	$("#create_button").click(function(){
		var chimpad_pad_title = $('#pad_title').val();
		var chimpad_pad_type = $('#pad_type_options').val();
	        $.ajax
	          ({
	            type: "POST",
	            //the url where you want to sent the userName and password to
	            url: "/create_pad",
	            //json object to sent to the authentication url
	            data : {
	            pad_type : chimpad_pad_type,
	            pad_title : chimpad_pad_title,
	            pad_collaborators : collaborator_array
	          } }).done(function(raw_data) {
	              var pad_id = raw_data[0]['id'];
	              var url = "/pad/" + pad_id;    
				  $(location).attr('href',url);          
	          });

	    }); 



});