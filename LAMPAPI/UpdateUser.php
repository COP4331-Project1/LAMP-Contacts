<?php

	$inData = getRequestInfo();

	// localhost, admin_username, password, database
	$conn = new mysqli("localhost", "group17", "cop4331c", "COP4331");

    //Get the user data
    $field = $inData["field"];
    $value = $inData["value"];

	// Attempt to connect to the server, and return error message if failed.
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Need to check whether the userName already exists as that is the only field that we accept as unique.
		if($field == "userName")
		{
			$sql = "SELECT userName FROM Users WHERE userName='" . $value . "'";

			// If any rows comeback, then there is an existing userName
			if(($result = $conn->query($sql))->num_rows > 0)
			{
				returnWithError("That username already exists!");
				$conn->close();
				return;
			}
		}
		
		// Set the respective fields along with their value according to the user ID.
		$sql =  "UPDATE Users SET ".$field." = '".$value."' WHERE ID = ".$inData["ID"];
		
		if ($result = $conn->query($sql) != TRUE)
		{
            returnWithError($conn->error);
		}

		returnWithError("Update Success.");

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
