<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $userName = $inData["userName"];
    $password = $inData["password"];
	$email = $inData["email"];

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
        // This is selecting based on login and password matching. We just need to select on username and thats it.
        $sql = "SELECT ID,FirstName,LastName FROM Users where Login='" . $inData["userName"] . "'";
		
        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            // This username already exists, abort.
            returnWithError("This username already exists, try another one.");

        }   
        else
        {
			// It does not exist, therefore allow it to be created.
			// Going to try without single quotes for each argument since it'd be annoying to concat.
            $sql = "insert into Users (FirstName,LastName,UserName,Password,Email) VALUES (" . $firstName . "," . $lastName . "," . $userName . "," . $password . "," $email .")";
			
            if($result = $conn->query($sql) != TRUE)
            {
                returnWithError(conn->error);
            }
			
			returnWithError("Successful Register.");
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>