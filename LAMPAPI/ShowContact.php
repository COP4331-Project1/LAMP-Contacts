<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost","group17", "cop4331c", "COP4331");

    $firstName = "";
    $lastName = "";
    $phoneNumber = "";
    $email = "";
    $address = "";

    if($conn->connect_error)
    {
        returnWithError();

    }
    else
    {
        $sql = "SELECT firstName,lastName,userName,email FROM Contacts WHERE ID=" . $inData["ID"];

        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            $phoneNumber = $row["firstName"];
            $email = $row["lastName"];
            $address = $row["userName"];
            $contactFirstName = $row["email"];
    

            returnWithInfo($contactFirstName,$contactLastName,$phoneNumber, $email, $address);
        }
        else
        {
            returnWithError("That contact does not exist given the CID.");
        }
        
        
        $conn->close();
    }

    function getRequestInfo()
	{
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
    
    function returnWithInfo($contactFirstName,$contactLastName,$phoneNumber, $email, $address)
	{
		$retValue = '{"contactFirstName":"' . $contactFirstName . '","contactLastName":"' . $contactLastName . '","phoneNumber":"' . $phoneNumber . '","email":"' . $email . '","address":"' . $address . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
