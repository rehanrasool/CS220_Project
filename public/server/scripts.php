<?php 

if(isset($_POST['user_id_get_pads'])){
	die(get_user_pads($_POST['user_id_get_pads'])); // get user pads
}

# This function reads your DATABASE_URL configuration automatically set by Heroku
# the return value is a string that will work with pg_connect
function pg_connection_string() {
  	return "dbname=d9ptr32iq13h5r host=ec2-54-163-235-165.compute-1.amazonaws.com p
user=xzvsvyawkprkod password=-hqT7covnCq5xAb56iToUQIIIW sslmode=require";
}
 


/*
This function returns all the user pads that the specified user ($user_id) has ever created
If there are no pads created then an empty assoc arra ywill be returned.
$user_id : the id of the user that will be used to find all his pads
return : associative array of all the pads of that user
*/
function get_user_pads($user_id){
		# Establish db connection
	$db = pg_connect(pg_connection_string());
	if (!$db) {
	    echo "Database connection error."
	    exit;
	}
	 
	$result = pg_query($db, "SELECT * FROM user_table");
	
	return $result; // return assoc array for all pads
	
}

?>