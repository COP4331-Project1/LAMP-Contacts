<?php
// Why no add?
$inData = getRequestInfo();

$conFirstName = $inData["contactFirstName"];
$conLastName = $inData["contactLastName"];
$phoneNumber = $inData["phoneNumber"];
$address = $inData["address"];
$email = $inData["contactEmail"];

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
	$sql = "SELECT contactFirstName,contactLastName FROM Contacts WHERE contactFirstName='" . $inData["contactFirstName"] . "' and contactLastName='" . $inData["contactLastName"] . "' and ID=" . $inData["ID"];

	$result = $conn->query($sql);

	// Check if any results come up
	if($result->num_rows > 0)
	{
		// The same exact contact already exists.
		returnWithError("This contact already exists.");
	}
	else
	{

		// Generates the mySql command to insert the request info.
        $sql = "insert into Contacts (ID,contactFirstName,contactLastName,phoneNumber,address,email) VALUES (". $inData["ID"] . ",'" . $conFirstName . "','" . $conLastName . "','" . $phoneNumber . "','" . $address . "','" . $email ."')";
		
		if($result = $conn->query($sql) != TRUE)
		{
			returnWithError($conn->error);
		}
		else
		{
			returnWithError("Successfully added contact.");
		}

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
