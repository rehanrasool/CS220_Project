<?php

if(isset($_POST['get_user_id']){
	die(get_user($_POST['get_user_id'])); // get user
}

if(isset($_POST['user_id_get_pads'])){
	die(get_user_pads($_POST['user_id_get_pads'])); // get user pads
}

if(isset($_POST['delete_pad_user_id']) && isset($_POST['delete_pad_id'])){ 
	die(leave_pad($_POST['delete_pad_user_id'],$_POST['delete_pad_id'])); // leave pad
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
This function removes the user from a pad with the specified id

$user_id : user's id
$pad_id : pad id that the user wants to remove himself from
*/
function leave_pad($user_id, $pad_id){
	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db

	$user_id_safe = mysqli_real_escape_string($chimpad_conn,$user_id); // SQL injection prevention
	$pad_id_safe = mysqli_real_escape_string($chimpad_conn,$pad_id); // SQL injection prevention

	$user_admin_query = "SELECT * FROM user_pad WHERE user_id = ". $user_id_safe . " AND " . "pad_id = " . $pad_id; // is user admin query

	$result_admin_query = mysqli_query($user_admin_query);

	if(!$result_admin_query){
			$result_admin_query  = 'Invalid query: ' . mysql_error() . "\n";
			$result_admin_query .= 'Whole query: ' . $query;
			return $result_admin_query; // return error message
		}

	if($result_admin_query->num_rows == 0){
		return "user does not has specified pad";
	}

	$user_data_array = $result_admin_query->fetch_assoc();
	
	if($user_data_array['admin'] == 0){ // 0 = user not admin

		$remove_pad_query = "DELETE * FROM user_pad where user_id = ". $user_id_safe . "AND" . "pad_id = " . $pad_id_safe;
		return "Pad Removed Successfully";

	}else{ // 1 = user is admin

		$remove_pad_query = "DELETE * FROM user_pad where pad_id = " . $pad_id_safe;
		$result_delete_all_pads_query = mysqli_query($remove_pad_query); // remove this pad from all users

		if(!$result_delete_all_pads_query){
			$result_delete_all_pads_query  = 'Invalid query: ' . mysql_error() . "\n";
			$result_delete_all_pads_query .= 'Whole query: ' . $query;
			return $result_delete_all_pads_query; // return error message

		}

		$remove_pad_from_database_query = "DELETE * FROM pad WHERE id = " . $pad_id_safe;
		$result_delete_all_pads_FROM_DB_query = mysqli_query($remove_pad_query); // remove this pad from database

		if(!$result_delete_all_pads_FROM_DB_query){
			$result_delete_all_pads_FROM_DB_query  = 'Invalid query: ' . mysql_error() . "\n";
			$result_delete_all_pads_FROM_DB_query .= 'Whole query: ' . $query;
			return $result_delete_all_pads_FROM_DB_query; // return error message

		}

		return "Pad Removed Successfully"

	}
}

/*
This function returns all the user pads that the specified user ($user_id) has ever created
If there are no pads created then an empty assoc arra ywill be returned.

$user_id : the id of the user that will be used to find all his pads

return : associative array of all the pads of that user
*/

function get_user_pads($user_id){
	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db

	$user_id_safe = mysqli_real_escape_string($chimpad_conn,$user_id); // SQL injection prevention

	$get_all_pads_query = "SELECT * FROM pad WHERE id IN (SELECT id FROM user_pad where id = ". $user_id_safe . ")";

	$result_pad_ids = mysqli_query($chimpad_conn,$get_all_pads_query);

	
	return $get_all_pads_query->fetch_assoc(); // return assoc array for all pads
	

}

/*
This function returns the associative array of the user with the given id
*/
function get_user($user_id){
	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db

	$user_id_safe = mysqli_real_escape_string($chimpad_conn,$user_id); // SQL injection prevention

	$get_user_query = "SELECT * FROM user where id = " . $user_id_safe;

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