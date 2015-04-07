<?php

/**
Author : Omar Waheed

This is authentication script that has two methods
(1) Sign_in
(2) sign_up

It get values from front end and uses them to interact with database to return/insert appropriate results if any to front-end 
or database respectively.
**/


session_start();

if(isset($_POST['username'] && isset($_POST['password'])){
	die(sign_in($_POST['username'], $_POST['password']));//authenticate & sign in
}else if(isset($_POST['username_signup'] && isset($_POST['password_signup']) && isset($_POST['email_signup']))){
	die(sign_up($_POST['username_signup'], $_POST['password_signup'], $_POST['email_signup']));
} 


/*
This function takes in username and password, passed from front-end, and uses this to 
authenticate if it actually exists in database. If yes then return a user_id else -1;

$username : username of user
$password : password of user
return : true if user exists else false
*/
function sign_in($username, $pass){
	//2 user : bluecu6_chimpad
	// 4db : bluecu6_chimpad
	//3pass : .chimpad.
	//1host : localhost

	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db
	$uname_safe = mysqli_real_escape_string($chimpad_conn,$username); // SQL injection prevention
	$pass_safe = mysqli_real_escape_string($chimpad_conn,$pass); // SQL injection prevention

	$query = "SELECT * FROM user 
							WHERE username = " . $uname_safe .
							 " AND " . "password = " . "pass_safe";


	$result = mysqli_query($chimpad_conn , $query); // execute query

	json_encode(-1); // -1 = false
	if (!$result) {
			    $return_value  = 'Invalid query: ' . mysql_error() . "\n";
			    $return_value .= 'Whole query: ' . $query;
			    
	}else{
		$user_id = -1;
	    while ($row = $result->fetch_assoc()) {
		        $user_id = $row['user_id'];
		        $user_name = $row['username'];
		}

		$_SESSION['user_id'] = $user_id;
		$_SESSION['user_name'] = $username;

		$return_value = json_encode($user_id); // set return value to user_id
	}

	return $return_value;

}



/*
This function signs up a user using his username, password and email. One constraint
that exists is that username is unique and if that already exists in database then
The return value of this function will be false.

$username : username of user
$password : password of user
$email 	  : email of user
*/
function sign_up($username, $pass, $email){
	$chimpad_conn = mysqli_connect('localhost','bluecu6_chimpad','.chimpad.','bluecu6_chimpad'); // conn to chimpad db
	$uname_safe = mysqli_real_escape_string($chimpad_conn,$username); // SQL injection prevention
	$pass_safe = mysqli_real_escape_string($chimpad_conn,$pass); // SQL injection prevention
	$email_safe = mysqli_real_escape_string($chimpad_conn,$email); // SQL injection prevention

	$query = "SELECT * FROM user WHERE user_name = " . "'" . $uname_safe . "'";

	$result = mysqli_query($chimpad_conn , $query); // execute query

	//now check if there was an exiting user by checking num of rows returned by query.

	if($result->num_rows == 0){ // no user exists with same username
		$insert_query = "INSERT INTO user(user_name,password,user_email) VALUES(".
																				"'" . $uname_safe . "'" . ","
																				"'" . $pass_safe . "'" . ","
																				"'" . $email_safe . "'" . ")";

		$insert_result = msqli_query($chimpad_conn,$insert_query);

		$user_id_query = "SELECT id FROM user WHERE username = " . "'" . $uname_safe . "'";

		$id_result = msqli_query($chimpad_conn,$user_id_query);

		$user_data_array = $id_result->fetch_assoc();

		$_SESSION['id'] = $user_data_array['id'];
		$_SESSION['username'] = $uname_safe;

		$return_message = "Username Created Successfully";
		return json_encode($return_message);
	}else{//there is an existing user with same username
		$return_message = "Username already taken. Please choose another"
		return json_encode($return_message);
	}

	


}



?>