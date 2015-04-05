<?php

if(isset($_POST['get_user_id']){
	die(get_user($_POST['get_user_id']));
}

if(isset($_POST['user_id_get_pads'])){
	die(get_user_pads($_POST['user_id_get_pads']));
}

/**
Author : Omar Waheed

This script has functions to get information from database as requested from front end
It consists of following methods:-

(1) get_all_users () -> associated array
(2) get_user ( user_id ) -> associated array
(3) get_user_pads ( user_id ) -> associative array
(4) leave_pad ( user_id, pad_id )
(5) get_pad ( pad_id ) -> associated array
(6) delete_pad ( pad_id, user_id ) -> true if deleted, false if not (not admin)
(7) create_pad ( user_id, title ) -> pad_id
(8) edit_pad ( pad_id , title, content, user ) -> return true/false (add timestamp yourself)
(9) get_pad_messages ( pad_id ) -> associative array order by timestamp
(10) send_message ( user_id, pad_id, content ) -> return true/false (add timestamp yourself)

 
**/


/*
This function returns all the user pads that the specified user ($user_id) has ever created
If there are no pads created then an empty assoc arra ywill be returned.

$user_id : the id of the user that will be used to find all his pads

return : associative array of all the pads of that user
*/

function get_user_pads($user_id){
	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db

	$user_id_safe = mysqli_real_escape_string($chimpad_conn,$user_id); // SQL injection prevention

	$get_all_pads_query = "SELECT * FROM pad WHERE id IN (SELECT pad_id FROM user_pad where user_id = ". $user_id_safe . ")";

	$result_pad_ids = mysqli_query($chimpad_conn,$get_all_pads_query);

	
	return $get_all_pads_query->fetch_assoc(); // return assoc array for all pads
	

}

/*
This function returns the associative array of the user with the given id
*/
function get_user($user_id){
	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db

	$user_id_safe = mysqli_real_escape_string($chimpad_conn,$user_id); // SQL injection prevention

	$get_user_query = "SELECT * FROM user where user_id = " . $user_id_safe;

	if(!$select_all_result){
		$select_all_result  = 'Invalid query: ' . mysql_error() . "\n";
		$select_all_result .= 'Whole query: ' . $query;
		return $select_all_result; // return error message

	}else{
		return $get_user_query->fetch_assoc(); // return associative array
	}

}


/*
This function returns the associative array of all the users.
In this array there are rows where each row is equal to the row in table.
To access it on front end you will need to use while loop to traverse through the array
*/
function get_all_users(){
	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db

	$select_all_query = "SELECT * FROM user";

	$select_all_result = mysqli_query($chimpad_conn,$select_all_result);

	if(!$select_all_result){
		$select_all_result  = 'Invalid query: ' . mysql_error() . "\n";
		$select_all_result .= 'Whole query: ' . $query;
		return $select_all_result; // return error message

	}else{
		return $select_all_result->fetch_assoc(); // associative array containing all fields and rows of users
	}


}




?>