<?php

	$inData = getRequestInfo();
	
	// localhost, admin_username, password, database
	$conn = new mysqli("localhost", "group17", "cop4331c", "COP4331");

	// Attempt to connect to the server, and return error message if failed.
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$sql = "DELETE FROM Users WHERE ID='". $inData["ID"] . "'";

		if ($result = $conn->query($sql) != TRUE)
		{
            returnWithError($conn->error);
		}
		else
		{
			returnWithError("Account successfully deleted.");
        }
        
		$conn->close();
	}

	function getRequestInfo()
	{
		// json_decode converts a json string into a mixed variable type. True to set associative type to true.
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>