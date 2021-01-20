<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = $inData["first"];
    $lastName = $inData["last"];
    $login = $inData["log"];
    $password = $inData["pass"];

	// localhost, admin_username, password, database
	$conn = new mysqli("localhost", "superU", "group17COP4331C", "ricklein_COP4331");

	// Attempt to connect to the server, and return error message if failed.
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	// Otherwise...
	else
	{
        // This is selecting based on login and password matching. We just need to select on username and thats it.
        $sql = "SELECT ID,firstname,lastname FROM Users where Login='" . $inData["login"] . "'";

        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            // This username already exists, abort.
            returnWithError("This username already exists, try another one.");

        }   
        else
        {
            // It does not exist, therefore allow it to be created.
            $sql = "insert into Users (First,Last,Log,Pass) VALUES (" . $firstName . "," . $lastName . "," . $login . "," . $password . "')";

            if($result = $conn->query($sql) != TRUE)
            {
                returnWithError(conn->error);
            }

        }

        $conn->close();
	}
    
    returnWithError("");

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