<?php

	$inData = getRequestInfo();
	
	// localhost, admin_username, password, database
	$conn = new mysqli("localhost", "group17", "cop4331c", "COP4331");
    
	$CID = $inData["CID"];
    $field = $inData["field"];
    $value = $inData["value"];

	// Attempt to connect to the server, and return error message if failed.
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	
		if(isDuplicate($conn, $CID, $field, $value))
		{
			returnWithError("That full name already exists!");
			$conn->close();
			return;
		}		

        $sql =  "UPDATE Contacts SET ".$field." = '".$value."' WHERE CID = ".$inData["CID"];

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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function debugging( $log )
	{
		$retValue = '{"log":"' . $log . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function isDuplicate($conn, $CID, $field, $value)
	{
		if(($field != "contactFirstName" && $field != "contactLastName"))
		{
			return false;
		}

		$currentTag = ($field == "contactFirstName") ? "contactLastName" : "contactFirstName"; 
		// First get the current contacts original info.
		$sql = "SELECT ". $currentTag . " FROM Contacts WHERE CID=" . $CID;
		$result = $conn->query($sql);

		if($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			// The other part of the name so we can verify the other name doesnt match.
			$currentValue = $result->row[$currentTag];

			$sql = "SELECT contactFirstName,contactLastName FROM Contacts WHERE " . $currentTag . "='" . $value . "' AND CID=" . $CID;
				
			if($result = $conn->query($sql)->num_rows > 0)
			{
				while ($row = mysql_fetch_array($result, MYSQL_ASSOC))
				{
					if($row[$currentTag] == $currentValue && $row[$field] == $value)
					{
						return true;
					}
				}

				return false;
			}
		}

	}
?>
