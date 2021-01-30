<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
    $email = "";
	
	// localhost, admin_username, password, database
	$conn = new mysqli("localhost", "group17", "cop4331c", "COP4331");

	// Attempt to connect to the server, and return error message if failed.
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	// Otherwise...
	else
	{
		// Grab ID, firstName, and lastName of the input login and password, generating an associative array.
		// The keys are then concatenated to generate a mysql command.
		// Users will be the table being pulled from.
		$sql = "SELECT ID, firstName, lastName , email FROM Users where userName='" . $inData["userName"] . "' and password='" . $inData["password"] . "'";

		// Perform a query on the database to test whether the login and password exist within the database.
		$result = $conn->query($sql);
		
		// If the num of rows within the resulting query are not greater, then there was no match.
		if ($result->num_rows > 0)
		{
			// the result is then turned into an associative array and stored accordingly.
			$row = $result->fetch_assoc();
			$firstName = $row["firstName"];
			$lastName = $row["lastName"];
            $email = $row["email"];
			$id = $row["ID"];
			
			// Then packaging the info as a JSON and sending it off.
			returnWithInfo($firstName, $lastName, $id, $email );
		}
		else
		{
			returnWithError( "No Records Found" );
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
	
	function returnWithInfo( $firstName, $lastName, $id,$email )
	{
		$retValue = '{"ID":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email. '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
