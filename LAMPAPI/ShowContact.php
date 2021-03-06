<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost","group17", "cop4331c", "COP4331");

    $contactFirstName = "";
    $contactLastName = "";
    $phoneNumber = "";
    $email = "";
    $address = "";
    $dateCreated = "";

    if($conn->connect_error)
    {
        returnWithError();

    }
    else
    {
        $sql = "SELECT contactFirstName,contactLastName,phoneNumber,email,address,dateCreated FROM Contacts WHERE CID=" . $inData["CID"];

        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            $phoneNumber = $row["phoneNumber"];
            $email = $row["email"];
            $address = $row["address"];
            $contactFirstName = $row["contactFirstName"];
            $contactLastName = $row["contactLastName"];
            $dateCreated = $row["dateCreated"];

            returnWithInfo($contactFirstName,$contactLastName,$phoneNumber, $email, $address, $dateCreated);
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
    
    function returnWithInfo($contactFirstName,$contactLastName,$phoneNumber, $email, $address, $dateCreated)
	{
		$retValue = '{"contactFirstName":"' . $contactFirstName 
            . '","contactLastName":"' . $contactLastName 
            . '","phoneNumber":"' . $phoneNumber 
            . '","email":"' . $email 
            . '","address":"' . $address
            . '","dateCreated":"' . $dateCreated
            . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
