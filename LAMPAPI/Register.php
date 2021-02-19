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

// Attempt to connect to the server
if ($conn->connect_error)
{
		returnWithError( $conn->connect_error );
}
else
{
	// Generate mySql command to return any Users given the userName supplied from request.
	$sql = "SELECT ID,firstName,lastName FROM Users where userName='" . $inData["userName"] . "'";

	$result = $conn->query($sql);

	// Check if any results come up
	if($result->num_rows > 0)
	{
		// This username already exists, abort.
		returnWithError("This username already exists, try another one.");
	}
	else
	{
		
		// Generates the mySql command to insert the request info.
		$sql = "insert into Users (firstName,lastName,userName,password,email) VALUES ('" . $firstName . "','" . $lastName . "','" . $userName . "','" . $password . "','" . $email ."')";
		
		if($result = $conn->query($sql) != TRUE)
		{
			returnWithError($conn->error);
		}

		returnWithError("Successfully registered user.");
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
